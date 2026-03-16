from django.db import models

class Categoria(models.Model):
    """
    Rappresenta la tabella 'Categoria' descritta nel PDF.
    Raggruppa le notizie per argomento (es. Sport, Tech).
    """
    nome = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    colore = models.CharField(max_length=7, default="#3B82F6") # Colore hex per il frontend

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorie'
        ordering = ['nome']

    def __str__(self):
        return self.nome
