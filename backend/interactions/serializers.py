from rest_framework import serializers
from .models.newssalvata import NewsSalvata
from news.models import Notizia

class NotiziaMinimalSerializer(serializers.ModelSerializer):
    """
    Serializer minimale per mostrare i dati principali della notizia salvata.
    """
    class Meta:
        model = Notizia
        fields = ['id', 'titolo', 'url_originale', 'data_pubblicazione', 'immagine_url']

class NewsSalvataSerializer(serializers.ModelSerializer):
    """
    Serializer per visualizzare una notizia salvata, includendo i dettagli della notizia.
    """
    notizia_dettaglio = NotiziaMinimalSerializer(source='notizia', read_only=True)

    class Meta:
        model = NewsSalvata
        fields = ['id', 'utente', 'notizia', 'notizia_dettaglio', 'salvata_at']
        read_only_fields = ['utente', 'salvata_at']

    def create(self, validated_data):
        # L'utente viene preso in automatico dalla request nelle views, non dal body JSON
        return super().create(validated_data)
