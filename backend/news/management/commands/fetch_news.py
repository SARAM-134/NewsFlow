<<<<<<< HEAD
import hashlib
import feedparser
import trafilatura
import re
from datetime import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from news.models.notizia import Notizia
from news.models.fonte import Fonte
class Command(BaseCommand):
    help = 'Estrae notizie e immagini da fonti RSS usando Trafilatura per il testo completo'

    def get_image_url(self, entry):
        """Tenta di estrarre l'URL dell'immagine da vari campi del feed RSS."""
        # 1. Cerca in media_content (Standard RSS avanzato)
        if 'media_content' in entry and len(entry.media_content) > 0:
            return entry.media_content[0].get('url')
        
        # 2. Cerca in enclosures (Standard podcast/allegati)
=======
import feedparser
import hashlib
import re
from django.core.management.base import BaseCommand
from django.utils import timezone
from news.models import Fonte, Notizia

class Command(BaseCommand):
    help = "Scarica le notizie dalle fonti RSS attive con estrazione immagini"

    def get_image_url(self, entry):
        """Tenta di estrarre l'URL dell'immagine da vari campi del feed."""
        # 1. Cerca in media_content
        if 'media_content' in entry and len(entry.media_content) > 0:
            return entry.media_content[0].get('url')
        
        # 2. Cerca in enclosures
>>>>>>> f4da9af (feat: Introduce core news model, project settings, and management commands for RSS fetching and AI processing.)
        if 'enclosures' in entry and len(entry.enclosures) > 0:
            for enc in entry.enclosures:
                if enc.get('type', '').startswith('image/'):
                    return enc.get('url')

<<<<<<< HEAD
        # 3. Fallback: Cerca un tag <img> nel summary o description tramite Regex
=======
        # 3. Fallback: Cerca un tag <img> nel summary o description
>>>>>>> f4da9af (feat: Introduce core news model, project settings, and management commands for RSS fetching and AI processing.)
        content = entry.get('summary', entry.get('description', ''))
        match = re.search(r'<img [^>]*src="([^"]+)"', content)
        if match:
            return match.group(1)
        
        return None

<<<<<<< HEAD
    def handle(self, *args, **kwargs):
        # Prendiamo solo le fonti attive e di tipo RSS dal DB
        fonti_attive = Fonte.objects.filter(attiva=True, tipo='rss')
        
        if not fonti_attive.exists():
            self.stdout.write(self.style.WARNING("Nessuna fonte RSS attiva trovata nel database."))
            return

        for fonte in fonti_attive:
            self.stdout.write(f"\nAnalizzando la fonte: {fonte.nome} ({fonte.url_feed})")
            
            try:
                # Parsing del feed RSS
                feed = feedparser.parse(fonte.url_feed)
                nuove_notizie = 0
                
                # Limitiamo a 15 articoli per fonte per non sovraccaricare il server
                for entry in feed.entries[:15]:
                    titolo = getattr(entry, 'title', 'Senza Titolo')
                    url_articolo = getattr(entry, 'link', '')
                    
                    if not url_articolo:
                        continue

                    # Generiamo l'hash univoco SHA-256
                    url_hash = hashlib.sha256(url_articolo.encode('utf-8')).hexdigest()
                    
                    if Notizia.objects.filter(url_hash=url_hash).exists():
                        continue

                    self.stdout.write(f"Scaricando: {titolo[:40]}...")
                    
                    # Estrazione immagine dall'RSS
                    img_url = self.get_image_url(entry)

                    # Estrazione del testo profondo dell'articolo
                    scaricato = trafilatura.fetch_url(url_articolo)
                    if not scaricato:
                        self.stdout.write(self.style.WARNING("  -> Impossibile scaricare la pagina HTML per il testo."))
                        continue
                        
                    contenuto_pulito = trafilatura.extract(scaricato)
                    
                    if not contenuto_pulito:
                        self.stdout.write(self.style.WARNING("  -> Testo principale non trovato."))
                        continue

                    # Recupero della data
                    data_pub = timezone.now()
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        try:
                            dt = datetime(*entry.published_parsed[:6])
                            data_pub = timezone.make_aware(dt)
                        except Exception:
                            pass # Fallback a timezone.now() già impostato

                    # Salvataggio nel database
                    Notizia.objects.create(
                        fonte=fonte,
                        categoria=fonte.categoria,
                        titolo=titolo,
                        contenuto_originale=contenuto_pulito,      # Il testo vero letto con Trafilatura
                        url_originale=url_articolo,
                        url_hash=url_hash,
                        immagine_url=img_url,            # L'immagine estratta dall'RSS
                        data_pubblicazione=data_pub
                    )
                    nuove_notizie += 1
                
                self.stdout.write(self.style.SUCCESS(f"Aggiunte {nuove_notizie} notizie per {fonte.nome}."))
                
                # Resetta contatore errori al successo
                fonte.ultimo_fetch = timezone.now()
                fonte.num_errori_consecutivi = 0
                fonte.save()

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Errore critico sulla fonte {fonte.nome}: {e}"))
                fonte.num_errori_consecutivi += 1
                
                # Disattiva se ci sono troppi errori (es. feed cancellato o URL cambiato)
                if fonte.num_errori_consecutivi >= 5:
                    fonte.attiva = False
                    self.stdout.write(self.style.ERROR(f"Fonte {fonte.nome} disattivata per troppi errori."))
                fonte.save()
=======
    def handle(self, *args, **options):
        fonti = Fonte.objects.filter(attiva=True)
        self.stdout.write(self.style.SUCCESS(f"Inizio parsing di {fonti.count()} fonti."))

        for fonte in fonti:
            self.stdout.write(f"--- Processando: {fonte.nome} ---")
            feed = feedparser.parse(fonte.url_feed)

            for entry in feed.entries:
                url = entry.link
                url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()

                if Notizia.objects.filter(url_hash=url_hash).exists():
                    continue

                # Estrazione immagine
                img_url = self.get_image_url(entry)

                data_pub = timezone.now()
                if hasattr(entry, 'published_parsed'):
                    try:
                        data_pub = timezone.datetime(*entry.published_parsed[:6])
                        data_pub = timezone.make_aware(data_pub)
                    except Exception:
                        data_pub = timezone.now()

                Notizia.objects.create(
                    fonte=fonte,
                    categoria=fonte.categoria, # Eredita la categoria della fonte
                    titolo=getattr(entry, 'title', 'Senza Titolo'),
                    contenuto_originale=entry.get('summary', entry.get('description', '')),
                    url_originale=url,
                    url_hash=url_hash,
                    immagine_url=img_url,
                    data_pubblicazione=data_pub,
                    ai_processata=False # Sarà elaborata dal job AI
                )
                self.stdout.write(self.style.SUCCESS(f"Nuova notizia: {getattr(entry, 'title', 'Senza Titolo')[:50]}..."))

        self.stdout.write(self.style.SUCCESS("Parsing completato!"))
>>>>>>> f4da9af (feat: Introduce core news model, project settings, and management commands for RSS fetching and AI processing.)
