from django.db import models

class Notizia(models.Model):
    SENTIMENT_CHOICES = [
        ('positivo', 'Positivo'),
        ('negativo', 'Negativo'),
        ('neutrale', 'Neutrale'),
    ]

    fonte = models.ForeignKey(
        'news.Fonte', 
        on_delete=models.CASCADE, 
        related_name='notizie'
    )
    categoria = models.ForeignKey(
        'news.Categoria', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='notizie'
    )
    tags = models.ManyToManyField(
        'news.Tag', 
        related_name='notizie', 
        blank=True
    )
    
    titolo = models.CharField(max_length=255)
    contenuto_originale = models.TextField(blank=True)
    url_originale = models.URLField(unique=True)
    url_hash = models.CharField(max_length=64, unique=True)
    immagine_url = models.URLField(max_length=1000, blank=True, null=True)
    data_pubblicazione = models.DateTimeField()
    
    extract_ai = models.TextField(blank=True, null=True)
    sentiment_ai = models.CharField(
        max_length=50, 
        choices=SENTIMENT_CHOICES, 
        blank=True, 
        null=True
    )
    provider_ai = models.CharField(max_length=100, blank=True, null=True)
    ai_processata = models.BooleanField(default=False)
    vettore_embedding = models.JSONField(null=True, blank=True)

    class Meta:
        verbose_name = 'Notizia'
        verbose_name_plural = 'Notizie'
        ordering = ['-data_pubblicazione']

    def __str__(self):
        return self.titolo
