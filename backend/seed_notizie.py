import os
import django
import json
import hashlib
from urllib.request import urlopen
from django.utils import timezone
from django.utils.text import slugify

# Imposta l'ambiente di Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newsflow_backend.settings')
django.setup()

from news.models import Notizia, Categoria, Fonte

def run_seed():
    print("Inizio popolamento database...")

    # 1. Recupera le categorie (create nel seed_fonti.py)
    cat_economia = Categoria.objects.get(nome="Economia")
    cat_tech = Categoria.objects.get(nome="Tecnologia")

    # 1b. Crea una Fonte di default (necessaria per il modello Notizia)
    fonte_demo, _ = Fonte.objects.get_or_create(
        nome="Demo GitHub", 
        defaults={"url_feed": "https://github.com/demo/feed.xml", "attiva": False}
    )

    # 2. Configurazione Sorgente Dati
    # Inserisci qui il link al file "Raw" di GitHub se vuoi scaricarle da remoto
    # Esempio: "https://raw.githubusercontent.com/tuo-user/newsflow/main/notizie.json"
    GITHUB_JSON_URL = None 

    notizie_data = []

    if GITHUB_JSON_URL:
        try:
            print(f"Scaricamento dati da GitHub: {GITHUB_JSON_URL}")
            with urlopen(GITHUB_JSON_URL) as response:
                notizie_data = json.loads(response.read().decode('utf-8'))
                print(f"✅ Scaricate {len(notizie_data)} notizie da GitHub.")
        except Exception as e:
            print(f"❌ Errore download da GitHub: {e}. Uso dati locali.")

    # Fallback: Se non abbiamo scaricato nulla, usa i dati di esempio locali
    if not notizie_data:
        notizie_data = [
            {
                "titolo": "I mercati reagiscono alla nuova riforma digitale",
                "riassunto": "L'analisi dei dati mostra un incremento del 15% negli investimenti tech...",
                "categoria": "Economia", # Uso stringhe per uniformità col JSON esterno
                "url": "https://example.com/mercati-riforma",
            },
            {
                "titolo": "L'Intelligenza Artificiale riscrive il giornalismo",
                "riassunto": "Nuovi algoritmi permettono riassunti in tempo reale con una precisione mai vista...",
                "categoria": "Tecnologia",
                "url": "https://example.com/ai-journalism",
            }
            ,
            {
                "titolo": "La BCE alza i tassi di interesse",
                "riassunto": "La Banca Centrale Europea annuncia un nuovo rialzo per contrastare l'inflazione...",
                "categoria": "Economia",
                "url": "https://example.com/bce-tassi",
            },
            {
                "titolo": "Nuovo visore VR lanciato sul mercato",
                "riassunto": "Il dispositivo promette di rivoluzionare il metaverso con risoluzione 8K...",
                "categoria": "Tecnologia",
                "url": "https://example.com/vr-launch",
            }
        ]

    for data in notizie_data:
        # Gestione dinamica: se la categoria è una stringa (dal JSON), la cerchiamo/creiamo
        nome_cat = data.get("categoria", "GENERALE")
        if isinstance(nome_cat, str):
            categoria_obj, _ = Categoria.objects.get_or_create(
                nome=nome_cat.capitalize(), 
                defaults={'slug': slugify(nome_cat)}
            )
        else:
            categoria_obj = nome_cat # Caso in cui sia già un oggetto (se usi variabili locali)

        # Prepara campi obbligatori
        titolo = data.get("titolo", "Senza Titolo")
        url_originale = data.get("url", f"https://demo-news.local/{slugify(titolo)}")
        riassunto = data.get("riassunto", "")
        
        # Genera un hash dell'URL per il campo obbligatorio url_hash
        url_hash = hashlib.sha256(url_originale.encode()).hexdigest()

        # Usiamo update_or_create basandoci sull'URL univoco per evitare duplicati
        Notizia.objects.get_or_create(
            url_originale=url_originale,
            defaults={
                "titolo": titolo,
                "contenuto_originale": data.get("contenuto", riassunto), # Se manca il contenuto, usa il riassunto
                "url_hash": url_hash,
                "extract_ai": riassunto, # Popola il campo che usa il frontend
                "categoria": categoria_obj,
                "fonte": fonte_demo,
                "data_pubblicazione": timezone.now(),
                "ai_processata": True # Le segniamo come già processate così appaiono subito
            }
        )

    print("Database popolato con successo!")

if __name__ == "__main__":
    run_seed()