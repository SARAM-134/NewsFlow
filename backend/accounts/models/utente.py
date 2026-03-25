from django.db import models
from news.models import Categoria

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
    AI_PROVIDERS = [
        ('gemini', 'Google Gemini'),
        ('groq', 'Groq (Llama 3)'),
        ('ollama', 'Ollama (Locale)'),
    ]

    role = models.CharField(max_length=20, choices=RUOLI, default='giornalista')
    nome = models.CharField(max_length=100, blank=True)
    cognome = models.CharField(max_length=100, blank=True)

    # Configurazione AI
    ai_provider = models.CharField(max_length=20, choices=AI_PROVIDERS, default='gemini')
    gemini_api_key = models.CharField(max_length=200, blank=True)
    groq_api_key = models.CharField(max_length=200, blank=True)
    # Ollama è locale, non richiede una chiave API
    ollama_model = models.CharField(max_length=100, blank=True, default='llama3',
                                    help_text="Nome del modello Ollama (es. llama3, mistral, gemma)")

    categorie_preferite = models.ManyToManyField(
        'news.Categoria',
        related_name='followers',
        blank=True
    )

    class Meta:
        verbose_name = 'Profilo Utente'
        verbose_name_plural = 'Profili Utenti'

    def __str__(self):
        return f"{self.nome} {self.cognome}"