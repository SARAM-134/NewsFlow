import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newsflow_backend.settings')
django.setup()

from news.models import Categoria, Fonte

def seed_fonti():
    print("Inizio popolamento database Fonti...")

    # 1. Creiamo le Categorie principali
    cat_cronaca, _ = Categoria.objects.get_or_create(nome='Cronaca', defaults={'slug': 'cronaca', 'colore': '#e74c3c'})
    cat_economia, _ = Categoria.objects.get_or_create(nome='Economia', defaults={'slug': 'economia', 'colore': '#27ae60'})
    cat_tech, _ = Categoria.objects.get_or_create(nome='Tecnologia', defaults={'slug': 'tecnologia', 'colore': '#2980b9'})

    print("✅ Categorie create.")

    fonti_data = [
        {'nome': 'Il Post', 'url': 'https://www.ilpost.it/feed/', 'cat': cat_cronaca},
        {'nome': 'ANSA Top News', 'url': 'https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml', 'cat': cat_cronaca},
        {'nome': 'Il Sole 24 Ore', 'url': 'https://www.ilsole24ore.com/rss/economia.xml', 'cat': cat_economia},
        {'nome': 'Wired Italia', 'url': 'https://www.wired.it/feed/rss', 'cat': cat_tech},
    ]

    for data in fonti_data:
        Fonte.objects.get_or_create(
            url_feed=data['url'],
            defaults={
                'nome': data['nome'],
                'categoria': data['cat'],
                'tipo': 'rss',
                'attiva': True
            }
        )
        print(f"✅ Fonte creata: {data['nome']}")

    print("Popolamento Fonti completato con successo! Pronto per lo scraping.")

if __name__ == '__main__':
    seed_fonti()
