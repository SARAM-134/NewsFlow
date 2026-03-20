import os
import django
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newsflow_backend.settings')
django.setup()

from news.models import Tag

def seed_tags():
    tags_list = [
        # Trasversali
        "Riforma", "Crisi", "Investimenti", "Digitale", "Sostenibilità", "Etica", "Normativa", "Diritti",
        # Politica, Esteri & Giustizia
        "Elezioni", "Geopolitica", "Unione Europea", "Diplomazia", "Sentenze", "Processi", "Sicurezza",
        # Economia, Lavoro & Innovazione
        "Mercati", "StartUp", "Borsa", "Sindacati", "Pensioni", "Intelligenza Artificiale", "Blockchain", "Smart Working",
        # Scienza, Salute & Ambiente
        "Ricerca Scientifica", "Medicina", "Prevenzione", "Cambiamento Climatico", "Energia Rinnovabile", "Spazio", "Biodiversità",
        # Spettacolo, Cultura & Società
        "Cinema", "Musica", "Letteratura", "Serie TV", "Social Media", "Istruzione", "Volontariato", "Tendenze",
        # Sport & Cronaca
        "Calcio", "Motori", "Olimpiadi", "Cronaca Nera", "Cronaca Bianca", "Inchiesta"
    ]

    print(f"Inizio popolamento di {len(tags_list)} tag standard...")
    
    count = 0
    for nome in tags_list:
        tag, created = Tag.objects.get_or_create(
            nome=nome,
            defaults={'slug': slugify(nome)}
        )
        if created:
            count += 1
            print(f"✅ Creato tag: {nome}")
        else:
            print(f"ℹ️ Tag già esistente: {nome}")

    print(f"Fine. Creati {count} nuovi tag.")

if __name__ == "__main__":
    seed_tags()
