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
    contenuto_originale = models.TextField(blank=True)
    url_originale = models.URLField(unique=True)
    url_hash = models.CharField(max_length=64, unique=True)
<<<<<<< HEAD
<<<<<<< HEAD
    immagine_url = models.URLField(max_length=1000, blank=True, null=True)
=======
    immagine_url = models.URLField(blank=True, null=True) # URL estratto dal feed o dall'AI
>>>>>>> f4da9af (feat: Introduce core news model, project settings, and management commands for RSS fetching and AI processing.)
=======
    immagine_url = models.URLField(max_length=1000, blank=True, null=True)
>>>>>>> 046e9eb (feat: Refine AI processing with updated Gemini prompt and configuration checks, integrate `.env` for settings, and adjust `Notizia` model fields.)
    data_pubblicazione = models.DateTimeField()
    
    extract_ai = models.TextField(blank=True, null=True)
    sentiment_ai = models.CharField(
        max_length=15, 
        choices=SENTIMENT_CHOICES, 
        blank=True, 
        null=True
    )
    provider_ai = models.CharField(max_length=100, blank=True, null=True)
    ai_processata = models.BooleanField(default=False)
<<<<<<< HEAD
<<<<<<< HEAD
=======
    tags = models.ManyToManyField('news.Tag', related_name='notizie', blank=True)
>>>>>>> 280115d (feat: Add `Notizia` model, `fetch_news` command for RSS parsing, and `process_ai` command for AI-driven news enrichment.)

    class Meta:
        verbose_name = 'Notizia'
        verbose_name_plural = 'Notizie'
        ordering = ['-data_pubblicazione']

    def __str__(self):
        return self.titolo
from django.db import models

class Notizia(models.Model):
    """
    Rappresenta la tabella 'Notizia' descritta nel PDF.
    Entità principale che contiene le informazioni aggregate dai feed RSS.
    """
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
    
    titolo = models.CharField(max_length=255)
    contenuto = models.TextField(blank=True)
    url_originale = models.URLField(unique=True)
    url_hash = models.CharField(max_length=64, unique=True)
    data_pubblicazione = models.DateTimeField()
    
    # Campi elaborati dall'AI
    extract_ai = models.TextField(blank=True, null=True)
    sentiment_ai = models.CharField(max_length=50, blank=True, null=True)
    provider_ai = models.CharField(max_length=100, blank=True, null=True)
=======
>>>>>>> 046e9eb (feat: Refine AI processing with updated Gemini prompt and configuration checks, integrate `.env` for settings, and adjust `Notizia` model fields.)

    class Meta:
        verbose_name = 'Notizia'
        verbose_name_plural = 'Notizie'
        ordering = ['-data_pubblicazione']

    def __str__(self):
        return self.titolo
