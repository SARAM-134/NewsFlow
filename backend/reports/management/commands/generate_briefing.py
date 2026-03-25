from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from news.models import Notizia, Categoria
from reports.models import Briefing
from news.ai_utils import call_ai, get_active_ai_config

class Command(BaseCommand):
    help = "Genera un Briefing/Newsletter di 3 paragrafi per ogni categoria basato sulle notizie delle ultime 24 ore."

    def handle(self, *args, **options):
        if not hasattr(settings, 'AI_CONFIG'):
            self.stdout.write(self.style.ERROR("ERRORE: Dizionario AI_CONFIG non trovato in settings.py"))
            return

        # 1. Risoluzione Provider e Chiave
        active_provider, active_key, active_model, active_ollama_model = get_active_ai_config()

        if not active_key and active_provider != 'ollama':
            self.stdout.write(self.style.ERROR(
                "ERRORE: Nessuna chiave API trovata. "
                "Imposta la chiave nel profilo del superuser o in AI_CONFIG."
            ))
            return

        self.stdout.write(self.style.SUCCESS(f"🤖 Provider AI selezionato: {active_provider.upper()}"))

        # 2. Iterazione Categorie
        categorie = Categoria.objects.all()
        if not categorie.exists():
            self.stdout.write(self.style.WARNING("Nessuna categoria trovata."))
            return

        ieri = timezone.now() - timedelta(days=1)

        for cat in categorie:
            self.stdout.write(f"--- Generazione Briefing per: {cat.nome} ---")

            # Selezioniamo le ultime 30 notizie della categoria processate dall'AI
            notizie = Notizia.objects.filter(
                categoria=cat,
                data_pubblicazione__gte=ieri,
                ai_processata=True
            )[:30]

            if not notizie.exists():
                self.stdout.write(f"Nessuna notizia processata nelle ultime 24h per {cat.nome}. Salto.")
                continue

            # Prepariamo il testo dei riassunti
            summaries_text = ""
            for i, n in enumerate(notizie, 1):
                summaries_text += f"{i}. {n.titolo}: {n.extract_ai}\n\n"

            # Prompt per il "Direttore di Redazione"
            prompt = f"""
            Agisci da Direttore di redazione per la sezione {cat.nome}. 
            Leggi questi {len(notizie)} riassunti di notizie delle ultime 24 ore e scrivimi un Briefing/Newsletter di esattamente 3 paragrafi con le tendenze principali di oggi.
            Usa un tono professionale, informativo e coinvolgente.
            Restituisci solo il testo del briefing, senza introduzioni o saluti.

            Notizie:
            {summaries_text}
            """

            try:
                contenuto_briefing = call_ai(
                    provider=active_provider,
                    api_key=active_key,
                    model_name=active_model,
                    prompt=prompt,
                    ollama_model=active_ollama_model
                )

                if not contenuto_briefing:
                    self.stdout.write(self.style.ERROR(f"Risposta vuota da {active_provider.upper()} per {cat.nome}"))
                    continue

                # 3. Salvataggio Briefing
                # Calcoliamo il titolo
                titolo_briefing = f"Briefing {cat.nome} - {timezone.now().strftime('%d/%m/%Y')}"
                
                # Creiamo l'oggetto Briefing
                briefing_obj = Briefing.objects.create(
                    titolo=titolo_briefing,
                    contenuto=contenuto_briefing,
                    categoria=cat
                )
                
                # Assocciamo le notizie
                briefing_obj.notizie.set(notizie)
                
                self.stdout.write(self.style.SUCCESS(f"OK: Briefing generato per {cat.nome}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"ERRORE {active_provider.upper()} per {cat.nome}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS("Fine sessione generazione Briefing."))
