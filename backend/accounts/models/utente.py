from django.db import models
from news.models import Categoria

class Utente(models.Model):
    auth = models.OneToOneField('accounts.Auth', on_delete=models.CASCADE, related_name='profilo')
    role = models.CharField(max_length=20, default='giornalista')
    nome = models.CharField(max_length=100, blank=True)
    cognome = models.CharField(max_length=100, blank=True)
    
    # Nuova relazione per gestire le specializzazioni/interessi del giornalista
    categorie_preferite = models.ManyToManyField(Categoria, blank=True, related_name='utenti_interessati')

    def __str__(self):
        return f"{self.nome} {self.cognome}"