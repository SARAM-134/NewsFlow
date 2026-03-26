from django.core.management.base import BaseCommand
from news.models import Notizia
from news.ai_utils import get_embedding_standard

class Command(BaseCommand):
    help = "Rigenera gli embedding mancanti per le notizie già processate dall'IA"

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Rifà l\'embedding anche se già presente')

    def handle(self, *args, **options):
        force = options.get('force', False)
        
        if force:
            notizie = Notizia.objects.filter(ai_processata=True)
        else:
            notizie = Notizia.objects.filter(ai_processata=True, vettore_embedding__isnull=True)

        total = notizie.count()
        self.stdout.write(f"🔍 Trovate {total} notizie da aggiornare.")

        count = 0
        count = 0
        import time
        for notizia in notizie:
            full_text = f"{notizia.titolo}. {notizia.extract_ai or notizia.contenuto_originale[:500]}"
            
            embedding = None
            retries = 0
            while retries < 3:
                try:
                    embedding = get_embedding_standard(full_text)
                    if embedding: break
                    # Se get_embedding_standard ritorna None senza eccezione (es. errore configurazione)
                    break 
                except Exception as e:
                    if "429" in str(e):
                        self.stdout.write(self.style.WARNING(f"   [!] Quota raggiunta. Attesa 60s..."))
                        time.sleep(60)
                        retries += 1
                    else:
                        self.stdout.write(self.style.ERROR(f"   [X] Errore: {e}"))
                        break
            
            if embedding:
                notizia.vettore_embedding = embedding
                notizia.save()
                count += 1
                if count % 10 == 0:
                    self.stdout.write(f"   [{count}/{total}] Embedding generati...")
                time.sleep(1) # Delay standard
            else:
                self.stdout.write(self.style.WARNING(f"   [!] Saltata: {notizia.titolo[:30]}..."))

        self.stdout.write(self.style.SUCCESS(f"✅ Completato! {count} embedding aggiornati."))
