import json
import google.generativeai as genai
from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils.text import slugify
from news.models import Notizia, Tag

class Command(BaseCommand):
    help = "Elabora le notizie pendenti usando l'AI (Gemini) per riassunti, sentiment e tag"

    def handle(self, *args, **options):
        # 1. Configurazione Gemini
        api_key = settings.AI_CONFIG.get('GEMINI_API_KEY')
        if not api_key:
            self.stdout.write(self.style.ERROR("ERRORE: GEMINI_API_KEY non configurata in settings.py"))
            return

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(settings.AI_CONFIG.get('MODEL_NAME', 'gemini-1.5-flash'))

        # Selezioniamo le notizie non ancora processate (limite a 5 per ogni esecuzione per evitare timeout)
        notizie = Notizia.objects.filter(ai_processata=False)[:5]
        
        if not notizie.exists():
            self.stdout.write(self.style.SUCCESS("Nessuna notizia da elaborare."))
            return

        for notizia in notizie:
            self.stdout.write(f"--- Elaborazione AI: {notizia.titolo} ---")
            
            # Prepariamo il prompt per Gemini
            prompt = f"""
            Analizza questa notizia e restituisci un JSON puro (senza markdown o backticks).
            Campi richiesti:
            - 'riassunto': un riassunto di massimo 3 righe che colga i punti chiave.
            - 'sentiment': una sola parola tra (Positivo, Negativo, Neutro).
            - 'tags': una lista di massimo 5 parole chiave (nomi propri di aziende, persone o ambiti tecnologici).

            Titolo: {notizia.titolo}
            Contenuto: {notizia.contenuto}
            """

            try:
                response = model.generate_content(prompt)
                
                # Pulizia della risposta per estrarre solo il JSON (spesso Gemini mette ```json ... ```)
                raw_text = response.text.strip()
                if "```json" in raw_text:
                    raw_text = raw_text.split("```json")[-1].split("```")[0].strip()
                elif "```" in raw_text:
                    raw_text = raw_text.split("```")[1].strip()

                data = json.loads(raw_text)

                # 2. Aggiornamento Notizia
                notizia.extract_ai = data.get('riassunto', '')
                notizia.sentiment_ai = data.get('sentiment', 'Neutro')
                notizia.provider_ai = "Google Gemini"
                notizia.ai_processata = True
                notizia.save()

                # 3. Gestione Tag
                tag_nomi = data.get('tags', [])
                for nome in tag_nomi:
                    # Crea il tag se non esiste, basandosi sullo slug
                    tag_slug = slugify(nome)
                    tag_obj, created = Tag.objects.get_or_create(
                        slug=tag_slug,
                        defaults={'nome': nome}
                    )
                    notizia.tags.add(tag_obj)

                self.stdout.write(self.style.SUCCESS(f"OK: Elaborazione completata per '{notizia.titolo}'"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"ERRORE durante l'elaborazione di '{notizia.titolo}': {str(e)}"))

        self.stdout.write(self.style.SUCCESS("Fine sessione elaborazione AI."))
