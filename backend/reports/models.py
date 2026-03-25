from django.db import models
from django.utils import timezone

class Report(models.Model):
    """Storico delle analisi AI richieste dagli utenti."""
    utente = models.ForeignKey('accounts.Utente', on_delete=models.CASCADE, related_name='reports')
    notizia = models.ForeignKey('news.Notizia', on_delete=models.CASCADE, related_name='reports')
    prompt_usato = models.TextField(blank=True, null=True)
    contenuto_generato = models.TextField()
    provider_ai = models.CharField(max_length=50, default="Gemini")
    generato_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Report {self.id} per {self.utente}"

class Briefing(models.Model):
    """Newsletter automatica aggregata per categoria."""
    categoria = models.ForeignKey('news.Categoria', on_delete=models.CASCADE, related_name='briefings')
    titolo = models.CharField(max_length=200)
    contenuto = models.TextField()
    notizie = models.ManyToManyField('news.Notizia', blank=True, related_name='briefings_inclusi')
    data_creazione = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.titolo