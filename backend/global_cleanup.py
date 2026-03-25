import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newsflow_backend.settings')
django.setup()

from news.models import Tag, Notizia, Categoria
from django.utils.text import slugify

def global_cleanup():
    print("1. Pulizia relazioni Tag-Notizia...")
    for n in Notizia.objects.all():
        n.tags.clear()
        # Puliamo anche il riassunto e il sentiment vecchio
        n.extract_ai = None
        n.sentiment_ai = None
        n.ai_processata = False
        n.save()
    
    print("2. Eliminazione di TUTTI i tag esistenti...")
    Tag.objects.all().delete()
    
    print("3. Re-seeding Tag Standard...")
    standard_tags = [
        "Riforma", "Crisi", "Investimenti", "Digitale", "Sostenibilità", "Etica", "Normativa", "Diritti",
        "Elezioni", "Geopolitica", "Unione Europea", "Diplomazia", "Sentenze", "Processi", "Sicurezza",
        "Mercati", "StartUp", "Borsa", "Sindacati", "Pensioni", "Intelligenza Artificiale", "Blockchain", "Smart Working",
        "Ricerca Scientifica", "Medicina", "Prevenzione", "Cambiamento Climatico", "Energia Rinnovabile", "Spazio", "Biodiversità",
        "Cinema", "Musica", "Letteratura", "Serie TV", "Social Media", "Istruzione", "Volontariato", "Tendenze",
        "Calcio", "Motori", "Olimpiadi", "Cronaca Nera", "Cronaca Bianca", "Inchiesta"
    ]
    
    for nome in standard_tags:
        Tag.objects.get_or_create(nome=nome, defaults={'slug': slugify(nome)})
    
    print(f"Fine. DB resettato con {len(standard_tags)} tag puliti e 0 relazioni.")

if __name__ == "__main__":
    global_cleanup()
