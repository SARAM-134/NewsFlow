import json
import time
import google.generativeai as genai
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth import get_user_model
from news.models import Notizia, Tag


def call_ai(provider: str, api_key: str, model_name: str, prompt: str, ollama_model: str = 'llama3') -> str:
    """
    Router universale verso il provider AI corretto.
    Supporta: gemini, groq, ollama
    """
    if provider == 'gemini':
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(prompt)
        return response.text

    elif provider == 'groq':
        from groq import Groq
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model='openai/gpt-oss-120b',
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content

    elif provider == 'ollama':
        # Ollama è compatibile con l'API OpenAI — gira in locale su port 11434
        from openai import OpenAI
        client = OpenAI(
            base_url='http://localhost:11434/v1',
            api_key='ollama',  # Placeholder, non usato ma richiesto dall'SDK
        )
        response = client.chat.completions.create(
            model=ollama_model or 'llama3',
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content

    else:
        raise ValueError(f"Provider AI non supportato: '{provider}'")


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
        User = get_user_model()
        active_provider = None
        active_key = None
        active_ollama_model = 'llama3'
        active_model = settings.AI_CONFIG.get('MODEL_NAME', '')

        for su in User.objects.filter(is_superuser=True).select_related('profilo'):
            if not hasattr(su, 'profilo'):
                continue
            p = su.profilo
            provider = p.ai_provider

            if provider == 'gemini' and p.gemini_api_key:
                active_provider = 'gemini'
                active_key = p.gemini_api_key
                break
            elif provider == 'groq' and p.groq_api_key:
                active_provider = 'groq'
                active_key = p.groq_api_key
                break
            elif provider == 'ollama':
                active_provider = 'ollama'
                active_key = None
                active_ollama_model = p.ollama_model or 'llama3'
                break

        # Fallback a settings globale (Gemini)
        if not active_provider:
            active_provider = 'gemini'
            active_key = settings.AI_CONFIG.get('GEMINI_API_KEY', '')

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
