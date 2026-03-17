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
        if 'enclosures' in entry and len(entry.enclosures) > 0:
            for enc in entry.enclosures:
                if enc.get('type', '').startswith('image/'):
                    return enc.get('url')

        # 3. Fallback: Cerca un tag <img> nel summary o description
        content = entry.get('summary', entry.get('description', ''))
        match = re.search(r'<img [^>]*src="([^"]+)"', content)
        if match:
            return match.group(1)
        
        return None

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
                    contenuto=entry.get('summary', entry.get('description', '')),
                    url_originale=url,
                    url_hash=url_hash,
                    immagine_url=img_url,
                    data_pubblicazione=data_pub,
                    ai_processata=False # Sarà elaborata dal job AI
                )
                self.stdout.write(self.style.SUCCESS(f"Nuova notizia: {getattr(entry, 'title', 'Senza Titolo')[:50]}..."))

        self.stdout.write(self.style.SUCCESS("Parsing completato!"))
