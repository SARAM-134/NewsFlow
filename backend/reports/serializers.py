from rest_framework import serializers
from .models.report import Report
from news.models import Notizia

class NotiziaMinimalReportSerializer(serializers.ModelSerializer):
    """
    Serializer minimale per mostrare a quale notizia è associato il report.
    """
    class Meta:
        model = Notizia
        fields = ['id', 'titolo', 'url_originale']

class ReportSerializer(serializers.ModelSerializer):
    """
    Serializer per visualizzare e creare report AI.
    """
    notizia_dettaglio = NotiziaMinimalReportSerializer(source='notizia', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'utente', 'notizia', 'notizia_dettaglio', 'provider_ai', 'contenuto', 'generato_at']
        read_only_fields = ['utente', 'generato_at']

    def create(self, validated_data):
        # L'utente loggato viene assegnato in automatico nelle views
        return super().create(validated_data)
