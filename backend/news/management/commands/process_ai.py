import json
import time
import google.generativeai as genai
from django.core.management.base import BaseCommand
from django.conf import settings
from news.models import Notizia, Tag

class Command(BaseCommand):
    help = "Elabora le notizie pendenti usando l'AI (Gemini) per riassunti, sentiment e tag"

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Loop continuo finché tutti gli articoli non processati sono stati elaborati',
        )

    def handle(self, *args, **options):
        # 1. Setup Gemini
        if not hasattr(settings, 'AI_CONFIG'):
            self.stdout.write(self.style.ERROR("ERRORE: AI_CONFIG non trovato in settings.py"))
            return

        api_key = settings.AI_CONFIG.get('GEMINI_API_KEY')
        if not api_key:
            self.stdout.write(self.style.ERROR("ERRORE: GEMINI_API_KEY mancante"))
            return

        genai.configure(api_key=api_key)

        # Cerca chiave utente: usa quella del primo superuser che ne ha una,
        # altrimenti fallback alla chiave globale di settings
        def get_api_key_for_user(user_auth=None):
            """Ritorna la chiave Gemini più appropriata per un dato utente."""
            if user_auth and hasattr(user_auth, 'profilo') and user_auth.profilo.gemini_api_key:
                return user_auth.profilo.gemini_api_key
            # Cerca un superuser con chiave configurata
            from django.contrib.auth import get_user_model
            User = get_user_model()
            for su in User.objects.filter(is_superuser=True):
                if hasattr(su, 'profilo') and su.profilo.gemini_api_key:
                    return su.profilo.gemini_api_key
            # Fallback globale
            return api_key

        # Per il processo batch usiamo la chiave migliore disponibile
        active_key = get_api_key_for_user()
        genai.configure(api_key=active_key)
        model = genai.GenerativeModel(settings.AI_CONFIG.get('MODEL_NAME', 'gemini-1.5-flash'))

        # 2. Tag disponibili nel DB
        db_tags = list(Tag.objects.values_list('nome', flat=True))
        tags_str = ", ".join(db_tags)
        standard_map = {t.lower(): t for t in db_tags}

        processa_tutto = options.get('all', False)
        batch_size = 20

        while True:
            # Prende SOLO articoli NON ancora processati
            notizie = list(Notizia.objects.filter(ai_processata=False)[:batch_size])

            if not notizie:
                self.stdout.write(self.style.SUCCESS("✅ Tutti gli articoli sono già stati processati."))
                break

            pending_total = Notizia.objects.filter(ai_processata=False).count()
            self.stdout.write(f"\n🔄 Batch di {len(notizie)} articoli | Rimangono in coda: {pending_total}")

            for notizia in notizie:
                self.stdout.write(f"  → {notizia.titolo[:70]}")

                prompt = f"""
                Analizza questa notizia e restituisci SOLO un JSON puro (senza markdown).
                
                Regole:
                - 'riassunto': massimo 3 righe in italiano.
                - 'sentiment': esattamente una tra: positivo, negativo, neutrale.
                - 'tags': lista di max 5 stringhe scelte da: [{tags_str}]
                  NON usare nomi propri. Solo dalla lista fornita.
                
                Titolo: {notizia.titolo}
                Contenuto: {notizia.contenuto_originale[:3000]}
                """

                try:
                    response = model.generate_content(prompt)
                    raw_text = response.text.strip()

                    # Pulizia del JSON dalla risposta
                    if "```json" in raw_text:
                        raw_text = raw_text.split("```json")[-1].split("```")[0].strip()
                    elif "```" in raw_text:
                        raw_text = raw_text.split("```")[1].strip()

                    data = json.loads(raw_text)

                    notizia.extract_ai = data.get('riassunto', '')
                    notizia.sentiment_ai = data.get('sentiment', 'neutrale').lower()
                    notizia.provider_ai = "Google Gemini"
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

                    self.stdout.write(self.style.SUCCESS(f"    ✓ OK"))
                    time.sleep(1)  # Pausa per evitare rate limit API

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"    ✗ ERRORE: {str(e)[:80]}"))

            # Se non si vuole processare tutto, esci dopo il primo batch
            if not processa_tutto:
                self.stdout.write(self.style.SUCCESS("\nFine batch. Usa --all per processare tutto in automatico."))
                break

            # Piccola pausa tra i batch per non saturare le API
            time.sleep(2)

        done = Notizia.objects.filter(ai_processata=True).count()
        total = Notizia.objects.count()
        self.stdout.write(self.style.SUCCESS(f"\n📊 Risultato finale: {done}/{total} articoli processati."))
