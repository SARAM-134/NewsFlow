from rest_framework import generics, permissions
from .models.report import Report
from .serializers import ReportSerializer

class ReportListCreateView(generics.ListCreateAPIView):
    """
    GET: Elenco dei report generati dall'utente loggato.
    POST: Salva un nuovo report AI generato (riceve notizia_id e provider_ai e contenuto).
    """
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(utente=self.request.user.profilo).select_related('notizia')

    def perform_create(self, serializer):
        serializer.save(utente=self.request.user.profilo)

class ReportDetailView(generics.RetrieveDestroyAPIView):
    """
    GET: Visualizza un report specifico.
    DELETE: Elimina un report salvato.
    """
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(utente=self.request.user.profilo)
