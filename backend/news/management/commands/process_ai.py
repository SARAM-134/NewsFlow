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
        if not hasattr(settings, 'AI_CONFIG'):
            self.stdout.write(self.style.ERROR("ERRORE: Dizionario AI_CONFIG non trovato in settings.py"))
            return

        api_key = settings.AI_CONFIG.get('GEMINI_API_KEY')
        if not api_key:
            self.stdout.write(self.style.ERROR("ERRORE: GEMINI_API_KEY non configurata o vuota in AI_CONFIG"))
        api_key = settings.AI_CONFIG.get('GEMINI_API_KEY')
        if not api_key:
            self.stdout.write(self.style.ERROR("ERRORE: GEMINI_API_KEY non configurata o vuota in AI_CONFIG"))
            return

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(settings.AI_CONFIG.get('MODEL_NAME', 'gemini-1.5-flash'))

        # 2. Recupero Tag Standard dal Database
        # Questo permette all'admin di aggiungere nuovi tag senza toccare il codice
        db_tags = list(Tag.objects.values_list('nome', flat=True))
        if not db_tags:
            self.stdout.write(self.style.WARNING("ATTENZIONE: Nessun tag trovato nel database. L'IA non potrà taggare nulla."))
            # Forniamo una lista minima di fallback se il db è vuoto? 
            # Preferibile lasciare vuoto per forzare l'admin a popolarlo.
        
        tags_str = ", ".join(db_tags)

        # Selezioniamo le notizie non ancora processate (limite a 5 per ogni esecuzione)
        # Selezioniamo le notizie non ancora processate (limite a 5 per ogni esecuzione per evitare timeout)
        # Selezioniamo le notizie non ancora processate (limite a 5 per ogni esecuzione)
        notizie = Notizia.objects.filter(ai_processata=False)[:5]
        
        if not notizie.exists():
            self.stdout.write(self.style.SUCCESS("Nessuna notizia da elaborare."))
            return

        for notizia in notizie:
            self.stdout.write(f"--- Elaborazione AI: {notizia.titolo} ---")
            
            # Prompt evoluto con tag dinamici dal DB
            prompt = f"""
            Analizza questa notizia e restituisci un JSON puro.
            Regole rigorose per i 'tags':
            - Scegli al massimo 5 tag esclusivamente dalla seguente lista approvata: 
              [{tags_str}]
            - È severamente VIETATO usare nomi propri di persone, aziende, città o luoghi specifici come tag.
            
            Campi JSON richiesti:
            - 'riassunto': massimo 3 righe.
            - 'sentiment': una tra POSITIVE, NEGATIVE, NEUTRAL.
            - 'tags': lista di stringhe (solo dalla lista sopra).
            
            Titolo: {notizia.titolo}
            Contenuto: {notizia.contenuto_originale}
            # Prompt evoluto con tag dinamici dal DB
            prompt = f"""
            Analizza questa notizia e restituisci un JSON puro.
            Regole rigorose per i 'tags':
            - Scegli al massimo 5 tag esclusivamente dalla seguente lista approvata: 
              [{tags_str}]
            - È severamente VIETATO usare nomi propri di persone, aziende, città o luoghi specifici come tag.
            
            Campi JSON richiesti:
            - 'riassunto': massimo 3 righe.
            - 'sentiment': una tra POSITIVE, NEGATIVE, NEUTRAL.
            - 'tags': lista di stringhe (solo dalla lista sopra).
            
            Titolo: {notizia.titolo}
            Contenuto: {notizia.contenuto}
            Contenuto: {notizia.contenuto_originale}
            """

            try:
                response = model.generate_content(prompt)
                
                # Pulizia della risposta per estrarre solo il JSON
                raw_text = response.text.strip()
                if "```json" in raw_text:
                    raw_text = raw_text.split("```json")[-1].split("```")[0].strip()
                elif "```" in raw_text:
                    raw_text = raw_text.split("```")[1].strip()

                data = json.loads(raw_text)

                # 3. Aggiornamento Notizia
                notizia.extract_ai = data.get('riassunto', '')
                notizia.sentiment_ai = data.get('sentiment', 'NEUTRAL')
                # 2. Aggiornamento Notizia coi NOMI CORRETTI
                # 3. Aggiornamento Notizia
                notizia.extract_ai = data.get('riassunto', '')
                notizia.sentiment_ai = data.get('sentiment', 'NEUTRAL')
                notizia.provider_ai = "Google Gemini"
                notizia.ai_processata = True
                notizia.save()

                # 4. Gestione Tag Filtrata (Lookup dinamico nel DB)
                tag_nomi_raw = data.get('tags', [])
                
                # Mappa case-insensitive per far corrispondere i tag di Gemini al DB
                # Usiamo i nomi esatti salvati nel DB
                standard_map = {t.lower(): t for t in db_tags}
                tag_nomi_validi = []
                for t in tag_nomi_raw:
                    t_lower = t.lower().strip()
                    if t_lower in standard_map:
                        tag_nomi_validi.append(standard_map[t_lower])
                
                for nome in tag_nomi_validi:
                    # Usiamo get perché sappiamo che il tag esiste nel DB (grazie al filtro sopra)
                    try:
                        tag_obj = Tag.objects.get(nome=nome)
                        notizia.tags.add(tag_obj)
                    except Tag.DoesNotExist:
                        continue
                tag_nomi = data.get('tags', [])
                for nome in tag_nomi:
                    tag_slug = slugify(nome)
                    tag_obj, created = Tag.objects.get_or_create(
                        slug=tag_slug,
                        defaults={
                            'nome': nome,
                            'categoria': notizia.categoria  # Eredita la categoria dell'articolo
                        }
                    )
                    notizia.tags.add(tag_obj)

                self.stdout.write(self.style.SUCCESS(f"OK: Elaborazione completata per '{notizia.titolo}'"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"ERRORE durante l'elaborazione di '{notizia.titolo}': {str(e)}"))

        self.stdout.write(self.style.SUCCESS("Fine sessione elaborazione AI."))
