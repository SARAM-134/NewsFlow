from django.db import models

class Tag(models.Model):
    """
    Rappresenta la tabella 'Tag' descritta nel PDF.
    Parole chiave generate automaticamente o manualmente per catalogare le notizie.
    """
    nome = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    
    # Relazione opzionale con Categoria se il tag è specifico di un ambito
    categoria = models.ForeignKey(
        'news.Categoria', 
        on_delete=models.CASCADE, 
        related_name='tags',
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        ordering = ['nome']

    def __str__(self):
        return self.nome
