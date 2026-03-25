import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newsflow_backend.settings')
django.setup()

from news.models import Categoria, Fonte

def seed_fonti():
    print("Inizio popolamento database Fonti...")

    # 1. Creiamo le Categorie (o agganciamo quelle esistenti)
    def get_cat(nome, slug, colore):
        c, _ = Categoria.objects.get_or_create(nome=nome, defaults={'slug': slug, 'colore': colore})
        return c

    cat_cronaca = get_cat('Cronaca', 'cronaca', '#e74c3c')      # Rosso
    cat_economia = get_cat('Economia', 'economia', '#27ae60')    # Verde
    cat_tech = get_cat('Tecnologia', 'tecnologia', '#2980b9')    # Blu
    cat_cultura = get_cat('Cultura', 'cultura', '#9b59b6')       # Viola
    cat_sport = get_cat('Sport', 'sport', '#f39c12')             # Arancio
    cat_scienza = get_cat('Scienza', 'scienza', '#1abc9c')       # Turchese
    cat_lifestyle = get_cat('Lifestyle', 'lifestyle', '#d35400')  # Mattone

    print("✅ Categorie (7) pronte.")

    fonti_data = [
        # CRONACA & MONDO
        {'nome': 'Il Post', 'url': 'https://www.ilpost.it/feed/', 'cat': cat_cronaca},
        {'nome': 'ANSA Top News', 'url': 'https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml', 'cat': cat_cronaca},
        {'nome': 'SkyTG24', 'url': 'https://tg24.sky.it/rss/tg24_mondo.xml', 'cat': cat_cronaca},
        {'nome': 'BBC News World', 'url': 'http://feeds.bbci.co.uk/news/world/rss.xml', 'cat': cat_cronaca},
        {'nome': 'CNN International', 'url': 'http://rss.cnn.com/rss/edition_world.rss', 'cat': cat_cronaca},
        
        # ECONOMIA
        {'nome': 'Il Sole 24 Ore', 'url': 'https://www.ilsole24ore.com/rss/economia.xml', 'cat': cat_economia},
        {'nome': 'Milano Finanza', 'url': 'https://www.milanofinanza.it/rss/mf_rss.xml', 'cat': cat_economia},
        {'nome': 'Financial Times News', 'url': 'https://www.ft.com/?format=rss', 'cat': cat_economia},
        
        # TECH
        {'nome': 'Wired Italia', 'url': 'https://www.wired.it/feed/rss', 'cat': cat_tech},
        {'nome': 'HDBlog', 'url': 'https://www.hdblog.it/feed/', 'cat': cat_tech},
        {'nome': 'TechCrunch', 'url': 'https://techcrunch.com/feed/', 'cat': cat_tech},
        {'nome': 'The Verge', 'url': 'https://www.theverge.com/rss/index.xml', 'cat': cat_tech},
        
        # CULTURA / INTRATTENIMENTO
        {'nome': 'Artribune', 'url': 'https://www.artribune.com/feed/', 'cat': cat_cultura},
        {'nome': 'Rolling Stone', 'url': 'https://www.rollingstone.it/feed/', 'cat': cat_cultura},
        {'nome': 'Pitchfork', 'url': 'https://pitchfork.com/feed/feed-all/', 'cat': cat_cultura},
        
        # SPORT
        {'nome': 'Gazzetta dello Sport', 'url': 'https://www.gazzetta.it/rss/home.xml', 'cat': cat_sport},
        {'nome': 'ESPN News', 'url': 'https://www.espn.com/espn/rss/news', 'cat': cat_sport},
        
        # SCIENZA / NATURA
        {'nome': 'Focus.it', 'url': 'https://www.focus.it/rss/scienza', 'cat': cat_scienza},
        {'nome': 'Le Scienze', 'url': 'https://www.lescienze.it/rss/all/rss.xml', 'cat': cat_scienza},
        {'nome': 'National Geographic', 'url': 'https://www.nationalgeographic.com/rss/index.xml', 'cat': cat_scienza},

        # LIFESTYLE / DESIGN
        {'nome': 'AD Italia', 'url': 'https://www.ad-italia.it/feed/rss', 'cat': cat_lifestyle},
        {'nome': 'Vanity Fair', 'url': 'https://www.vanityfair.it/feed/rss', 'cat': cat_lifestyle},
        {'nome': 'Design Milk', 'url': 'https://design-milk.com/feed/', 'cat': cat_lifestyle},
    ]

    for data in fonti_data:
        fonte, created = Fonte.objects.get_or_create(
            url_feed=data['url'],
            defaults={
                'nome': data['nome'],
                'categoria': data['cat'],
                'tipo': 'rss',
                'attiva': True
            }
        )
        if created:
            print(f"✅ Nuova fonte creata: {data['nome']}")
        else:
            # Aggiorniamo la categoria se è cambiata nel seed
            fonte.categoria = data['cat']
            fonte.save()
            print(f"🔄 Fonte esistente aggiornata: {data['nome']}")

    print("\n🚀 Database Fonti arricchito! Ora puoi lanciare 'python manage.py fetch_news'.")

if __name__ == '__main__':
    seed_fonti()
