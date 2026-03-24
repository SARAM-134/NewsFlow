from django.db import models
from django.conf import settings

class Utente(models.Model):
    """
    Modello profilo utente, legato 1:1 al modello Auth.
    Rappresenta la tabella 'Utente' descritta nel PDF.
    """
    RUOLI = [
        ('giornalista', 'Giornalista'),
        ('admin', 'Admin'),
    ]

    auth = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profilo'
    )
    role = models.CharField(max_length=20, choices=RUOLI, default='giornalista')
    nome = models.CharField(max_length=100, blank=True)
    cognome = models.CharField(max_length=100, blank=True)
    gemini_api_key = models.CharField(
        max_length=200,
        blank=True,
        help_text="Chiave API Gemini personale dell'utente. Se fornita, viene usata al posto di quella globale."
    )
    categorie_preferite = models.ManyToManyField(
        'news.Categoria',
        related_name='followers',
        blank=True
    )

    class Meta:
        verbose_name = 'Profilo Utente'
        verbose_name_plural = 'Profili Utenti'

    def __str__(self):
        return f"{self.nome} {self.cognome}".strip() or str(self.auth)
