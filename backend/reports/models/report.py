from django.db import models

class Report(models.Model):
    """
    Rappresenta un Briefing AI generato su richiesta da un utente
    riguardo una specifica notizia.
    """
    PROVIDER_SCELTE = [
        ('openai', 'OpenAI'),
        ('gemini', 'Gemini'),
        ('anthropic', 'Anthropic'),
    ]

    utente = models.ForeignKey(
        'accounts.Utente',
        on_delete=models.CASCADE,
        related_name="reports"
    )
    notizia = models.ForeignKey(
        'news.Notizia',
        on_delete=models.CASCADE,
        related_name="reports"
    )
    provider_ai = models.CharField(max_length=20, choices=PROVIDER_SCELTE)
    contenuto = models.TextField()
    generato_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Report"
        verbose_name_plural = "Reports"
        ordering = ["-generato_at"]

    def __str__(self):
        return f"Report '{self.provider_ai}' per {self.utente.nome_completo}"
