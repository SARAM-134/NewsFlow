from rest_framework import generics, permissions
from .models import Report, Briefing
from .serializers import ReportSerializer, BriefingSerializer

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

class BriefingListView(generics.ListAPIView):
    """
    GET: Elenco di tutti i briefing generati (per admin o consultazione generale).
    """
    queryset = Briefing.objects.all()
    serializer_class = BriefingSerializer
    permission_classes = [permissions.IsAuthenticated]

class MyBriefingsView(generics.ListAPIView):
    """
    GET: Restituisce l'ultimo briefing per ciascuna categoria seguita dall'utente loggato.
    """
    serializer_class = BriefingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.profilo
        user_categories = user.categorie_preferite.all()
        
        # Per ogni categoria seguita, recuperiamo l'ID dell'ultimo briefing generato
        last_briefing_ids = []
        for cat in user_categories:
            ultimo = Briefing.objects.filter(categoria=cat).order_by('-data_creazione').first()
            if ultimo:
                last_briefing_ids.append(ultimo.id)
        
        return Briefing.objects.filter(id__in=last_briefing_ids)
