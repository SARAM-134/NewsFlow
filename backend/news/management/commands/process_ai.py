import json
import time
from django.core.management.base import BaseCommand
from django.conf import settings
from news.models import Notizia, Tag


from news.ai_utils import call_ai, get_active_ai_config

class Command(BaseCommand):
    help = "Elabora le notizie pendenti con AI (Gemini / Groq / Ollama)"

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Loop continuo finché tutti gli articoli pendenti non sono elaborati',
        )

    def handle(self, *args, **options):
        if not hasattr(settings, 'AI_CONFIG'):
            self.stdout.write(self.style.ERROR("ERRORE: AI_CONFIG non trovato in settings.py"))
            return

        # --- Risoluzione Provider e Chiave ---
        active_provider, active_key, active_model, active_ollama_model = get_active_ai_config()

        if not active_key and active_provider != 'ollama':
            self.stdout.write(self.style.ERROR(
                "ERRORE: Nessuna chiave API trovata. "
                "Imposta la chiave nel profilo del superuser o in AI_CONFIG."
            ))
            return

        self.stdout.write(f"🤖 Provider AI: {active_provider.upper()}")
        if active_provider == 'ollama':
            self.stdout.write(f"   Modello Ollama: {active_ollama_model}")

        # --- Tag disponibili ---
        db_tags = list(Tag.objects.values_list('nome', flat=True))
        tags_str = ", ".join(db_tags)
        standard_map = {t.lower(): t for t in db_tags}

        processa_tutto = options.get('all', False)
        batch_size = 20

        while True:
            notizie = list(Notizia.objects.filter(ai_processata=False)[:batch_size])
            if not notizie:
                self.stdout.write(self.style.SUCCESS("✅ Tutti gli articoli sono già stati processati."))
                break

            pending = Notizia.objects.filter(ai_processata=False).count()
            self.stdout.write(f"\n🔄 Batch di {len(notizie)} | Rimangono in coda: {pending}")

            for notizia in notizie:
                self.stdout.write(f"  → {notizia.titolo[:70]}")

                prompt = f"""
                Analizza questa notizia e restituisci SOLO un JSON puro (senza markdown).

                Campi richiesti:
                - "riassunto": massimo 3 righe in italiano.
                - "sentiment": una tra: positivo, negativo, neutrale.
                - "tags": lista di max 5 stringhe dalla lista: [{tags_str}]
                  (NON usare nomi propri, solo dalla lista)

                Titolo: {notizia.titolo}
                Contenuto: {notizia.contenuto_originale[:3000]}
                """

                try:
                    raw_text = call_ai(
                        provider=active_provider,
                        api_key=active_key,
                        model_name=active_model,
                        prompt=prompt,
                        ollama_model=active_ollama_model
                    )

                    # Pulizia JSON
                    if "```json" in raw_text:
                        raw_text = raw_text.split("```json")[-1].split("```")[0].strip()
                    elif "```" in raw_text:
                        raw_text = raw_text.split("```")[1].strip()

                    data = json.loads(raw_text)

                    notizia.extract_ai = data.get('riassunto', '')
                    notizia.sentiment_ai = data.get('sentiment', 'neutrale').lower()
                    notizia.provider_ai = active_provider
                    notizia.ai_processata = True
                    notizia.save()

                    # Tags
                    for t in data.get('tags', []):
                        t_lower = t.lower().strip()
                        if t_lower in standard_map:
                            try:
                                notizia.tags.add(Tag.objects.get(nome=standard_map[t_lower]))
                            except Tag.DoesNotExist:
                                pass

                    self.stdout.write(self.style.SUCCESS("    ✓ OK"))
                    time.sleep(1)

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"    ✗ ERRORE: {str(e)[:100]}"))

            if not processa_tutto:
                self.stdout.write("\nUsa --all per processare tutto in automatico.")
                break

            time.sleep(2)

        done = Notizia.objects.filter(ai_processata=True).count()
        total = Notizia.objects.count()
        self.stdout.write(self.style.SUCCESS(f"\n📊 Risultato: {done}/{total} articoli processati."))
