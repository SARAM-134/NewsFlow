from django.db import models

class Fonte(models.Model):
    """
    Rappresenta la tabella 'Fonte' descritta nel PDF.
    Sorgente da cui vengono aggregate le notizie (feed RSS o API).
    """
    TIPI_FONTE = [
        ('rss', 'RSS Feed'),
        ('api', 'API'),
    ]

    nome = models.CharField(max_length=100)
    url_feed = models.URLField(unique=True)
    tipo = models.CharField(max_length=10, choices=TIPI_FONTE, default='rss')
    
    # Relazione con Categoria
    categoria = models.ForeignKey(
        'news.Categoria', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='fonti'
    )
    
    attiva = models.BooleanField(default=True)
    
    # Campi tecnici per il monitoraggio del fetcher
    ultimo_fetch = models.DateTimeField(null=True, blank=True)
    num_errori_consecutivi = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Fonte'
        verbose_name_plural = 'Fonti'
        ordering = ['nome']

    def __str__(self):
        return self.nome
