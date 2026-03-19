from django.db import models

class Briefing(models.Model):
    """
    Rappresenta un Briefing/Newsletter giornaliero generato dall'AI
    per una specifica categoria di notizie.
    """
    titolo = models.CharField(max_length=255)
    contenuto = models.TextField() # I 3 paragrafi generati
    categoria = models.ForeignKey(
        'news.Categoria',
        on_delete=models.CASCADE,
        related_name='briefings'
    )
    notizie = models.ManyToManyField(
        'news.Notizia',
        related_name='briefings',
        blank=True
    )
    data_creazione = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Briefing"
        verbose_name_plural = "Briefings"
        ordering = ["-data_creazione"]

    def __str__(self):
        return f"{self.titolo} ({self.categoria.nome})"
