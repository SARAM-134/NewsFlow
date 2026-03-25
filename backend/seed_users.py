import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newsflow_backend.settings')
django.setup()

from accounts.models.auth import Auth
from accounts.models.utente import Utente

def seed_users():
    print("Inizio popolamento database utenti...")

    # Pulisci utenti esistenti per evitare conflitti se si esegue più volte
    Auth.objects.all().delete()
    print("Vecchi utenti rimossi.")

    # 1. Creiamo un Admin (Superuser)
    admin_auth = Auth.objects.create_superuser(
        email='admin@newsflow.com',
        username='admin_principale',
        password='adminpassword123'
    )
    Utente.objects.create(
        auth=admin_auth,
        role='admin',
        nome='Sara',
        cognome='Admin'
    )
    print("✅ Creato Admin (admin@newsflow.com / adminpassword123)")

    # 2. Creiamo alcuni Giornalisti fittizi
    giornalisti_data = [
        {'email': 'mario.rossi@newsflow.com', 'username': 'marior', 'nome': 'Mario', 'cognome': 'Rossi'},
        {'email': 'luigi.verdi@newsflow.com', 'username': 'luigiv', 'nome': 'Luigi', 'cognome': 'Verdi'},
        {'email': 'giulia.blu@newsflow.com', 'username': 'giuliab', 'nome': 'Giulia', 'cognome': 'Blu'},
    ]

    for data in giornalisti_data:
        giornalista_auth = Auth.objects.create_user(
            email=data['email'],
            username=data['username'],
            password='giornalistapassword123'
        )
        Utente.objects.create(
            auth=giornalista_auth,
            role='giornalista',
            nome=data['nome'],
            cognome=data['cognome']
        )
        print(f"✅ Creato Giornalista ({data['email']} / giornalistapassword123)")

    print("Popolamento completato con successo!")

if __name__ == '__main__':
    seed_users()
