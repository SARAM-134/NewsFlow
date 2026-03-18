from django.db import models
from accounts.models import Utente
from news.models import Notizia

class NewsSalvata(models.Model):
    """
    Archivio personale delle notizie salvate dall'utente.
    Tabella pivot che gestisce la relazione N:N tra Utente e Notizia.
    """
    utente = models.ForeignKey(
        Utente,
        on_delete=models.CASCADE,
        related_name="notizie_salvate"
    )
    notizia = models.ForeignKey(
        Notizia,
        on_delete=models.CASCADE,
        related_name="salvata_da"
    )
    salvata_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Notizia Salvata"
        verbose_name_plural = "Notizie Salvate"
        unique_together = ('utente', 'notizia') # Impedisce doppi salvataggi dello stesso articolo
        ordering = ["-salvata_at"]

    def __str__(self):
        return f"{self.utente.nome_completo} ha salvato: {self.notizia.titolo}"
