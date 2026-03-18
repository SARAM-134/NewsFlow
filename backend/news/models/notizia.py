from django.db import models

class Notizia(models.Model):
    SENTIMENT_CHOICES = [
        ('POSITIVE', 'Positive'),
        ('NEGATIVE', 'Negative'),
        ('NEUTRAL', 'Neutral'),
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
    contenuto = models.TextField(blank=True)
    url_originale = models.URLField(unique=True)
    url_hash = models.CharField(max_length=64, unique=True)
    data_pubblicazione = models.DateTimeField()
    
    extract_ai = models.TextField(blank=True, null=True)
    sentiment_ai = models.CharField(
        max_length=15, 
        choices=SENTIMENT_CHOICES, 
        blank=True, 
        null=True
    )
    provider_ai = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = 'Notizia'
        verbose_name_plural = 'Notizie'
        ordering = ['-data_pubblicazione']

    def __str__(self):
        return self.titolo
