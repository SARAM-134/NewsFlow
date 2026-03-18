from rest_framework import serializers
from .models.categoria import Categoria
from .models.fonte import Fonte
from .models.notizia import Notizia
from .models.tag import Tag

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class FonteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fonte
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class NotiziaSerializer(serializers.ModelSerializer):
<<<<<<< HEAD
    categoria_dettaglio = CategoriaSerializer(source='categoria', read_only=True)
    fonte_dettaglio = FonteSerializer(source='fonte', read_only=True)
    tags_dettaglio = TagSerializer(source='tags', many=True, read_only=True) 
=======
    """
    Serializer principale per le notizie. 
    In lettura, espande categoria, fonte e tag per una visualizzazione completa.
    """
    categoria_dettaglio = CategoriaSerializer(source='categoria', read_only=True)
    fonte_dettaglio = FonteSerializer(source='fonte', read_only=True)
    tags_dettaglio = TagSerializer(source='tag_set', many=True, read_only=True) # Usiamo tag_set se è ManyToMany o legame inverso
>>>>>>> 8c25fe3 (feat: Implement initial News API endpoints, serializers, and URL routing, introduce `NewsSalvata` and `Report` models, and update admin and account migrations.)

    class Meta:
        model = Notizia
        fields = [
<<<<<<< HEAD
            'id', 'titolo', 'contenuto_originale', 'url_originale', 'url_hash', 'immagine_url',
            'data_pubblicazione', 'extract_ai', 'sentiment_ai', 'provider_ai',
            'categoria', 'categoria_dettaglio', 
            'fonte', 'fonte_dettaglio',
            'tags', 'tags_dettaglio'
=======
            'id', 'titolo', 'contenuto', 'url_originale', 'url_hash', 
            'data_pubblicazione', 'extract_ai', 'sentiment_ai', 'provider_ai',
            'categoria', 'categoria_dettaglio', 
            'fonte', 'fonte_dettaglio',
            'tags_dettaglio'
>>>>>>> 8c25fe3 (feat: Implement initial News API endpoints, serializers, and URL routing, introduce `NewsSalvata` and `Report` models, and update admin and account migrations.)
        ]
