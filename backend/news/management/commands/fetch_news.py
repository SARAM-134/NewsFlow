import hashlib
import feedparser
import trafilatura
import re
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
from django.db import IntegrityError
from news.models.notizia import Notizia
from news.models.fonte import Fonte
from news.models.categoria import Categoria
import requests

class Command(BaseCommand):
    help = 'Estrae notizie e immagini da fonti RSS e API usando Trafilatura'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=15,
            help='Numero massimo di articoli per ogni fonte RSS (default: 15)'
        )

    def get_image_url(self, entry):
        """Estrae l'URL dell'immagine con logica di fallback."""
        if 'media_content' in entry and entry.media_content:
            return entry.media_content[0].get('url')
        
        if 'enclosures' in entry and entry.enclosures:
            for enc in entry.enclosures:
                if enc.get('type', '').startswith('image/'):
                    return enc.get('url')

        content = entry.get('summary', entry.get('description', ''))
        match = re.search(r'<img [^>]*src="([^"]+)"', content)
        return match.group(1) if match else None

    def fetch_full_content(self, url):
        """Helper per scaricare e pulire il testo di un articolo."""
        try:
            downloaded = trafilatura.fetch_url(url)
            if downloaded:
                return trafilatura.extract(downloaded)
        except Exception:
            return None
        return None

    def get_news_from_api(self, api_key, query, language='it', page_size=10):
        url = "https://newsapi.org/v2/everything"
        params = {'q': query, 'language': language, 'pageSize': page_size, 'apiKey': api_key}
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json().get('articles', [])
        except Exception as e:
            self.stderr.write(f"Errore API: {e}")
            return []

    def handle(self, *args, **kwargs):
        # Configurazione API da settings
        news_api_config = getattr(settings, 'NEWS_CONFIG', {})
        API_KEY = news_api_config.get("NEWS_API_KEY")
        QUERY_DEFAULT = "tecnologia"
        limit = kwargs.get('limit', 15)

        fonti_attive = Fonte.objects.filter(attiva=True, tipo='rss')
        
        # --- LOGICA RSS ---
        for fonte in fonti_attive:
            self.stdout.write(f"Analizzando: {fonte.nome}")
            feed = feedparser.parse(fonte.url_feed)
            
            nuove_notizie = 0
            for entry in feed.entries[:limit]:
                url_articolo = getattr(entry, 'link', '')
                if not url_articolo: continue

                url_hash = hashlib.sha256(url_articolo.encode('utf-8')).hexdigest()
                
                if Notizia.objects.filter(url_hash=url_hash).exists():
                    continue

                testo = self.fetch_full_content(url_articolo)
                if not testo: continue

                # Parsing data
                data_pub = timezone.now()
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    try:
                        data_pub = timezone.make_aware(datetime(*entry.published_parsed[:6]))
                    except Exception: pass

                try:
                    Notizia.objects.create(
                        fonte=fonte,
                        categoria=fonte.categoria,
                        titolo=getattr(entry, 'title', 'Senza Titolo'),
                        contenuto_originale=testo,
                        url_originale=url_articolo,
                        url_hash=url_hash,
                        immagine_url=self.get_image_url(entry),
                        data_pubblicazione=data_pub
                    )
                    nuove_notizie += 1
                except IntegrityError:
                    continue 

            self.stdout.write(self.style.SUCCESS(f"Aggiunte {nuove_notizie} notizie per {fonte.nome}."))

        # --- LOGICA API ---
        if API_KEY and API_KEY != "IL_TUO_API_KEY_QUI" and API_KEY != "6b6798f000000000000000000000000b":
            self.stdout.write("\nRecupero notizie tramite API...")
            # Cerchiamo o creiamo una categoria "NewsAPI" per gli articoli da API
            cat_api, _ = Categoria.objects.get_or_create(nome="NewsAPI", defaults={'slug': 'newsapi'})
            
            articles = self.get_news_from_api(API_KEY, QUERY_DEFAULT, page_size=limit)
            
            nuove_api = 0
            for art in articles:
                url_art = art.get('url')
                if not url_art: continue
                u_hash = hashlib.sha256(url_art.encode('utf-8')).hexdigest()

                if not Notizia.objects.filter(url_hash=u_hash).exists():
                    full_txt = self.fetch_full_content(url_art) or art.get('description', '')
                    if not full_txt: continue

                    try:
                        Notizia.objects.create(
                            fonte=None,
                            categoria=cat_api,
                            titolo=art.get('title', 'Senza Titolo'),
                            contenuto_originale=full_txt,
                            url_originale=url_art,
                            url_hash=u_hash,
                            immagine_url=art.get('urlToImage'),
                            data_pubblicazione=timezone.now()
                        )
                        nuove_api += 1
                    except IntegrityError:
                        continue

            self.stdout.write(self.style.SUCCESS(f"Processo completato! ({nuove_api} notizie da API)"))
        else:
            self.stdout.write(self.style.WARNING("\nNewsAPI non configurata o chiave mancante (saltata)."))