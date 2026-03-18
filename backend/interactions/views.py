from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models.newssalvata import NewsSalvata
from .serializers import NewsSalvataSerializer

class NewsSalvataListCreateView(generics.ListCreateAPIView):
    """
    GET: Ottiene la lista di tutte le notizie salvate dall'utente loggato.
    POST: Permette di salvare una nuova notizia.
    """
    serializer_class = NewsSalvataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtra automaticamente per l'utente loggato
        return NewsSalvata.objects.filter(utente=self.request.user.profilo).select_related('notizia')

    def perform_create(self, serializer):
        # Assegna in automatico l'utente loggato come colui che salva la notizia
        serializer.save(utente=self.request.user.profilo)

class NewsSalvataDetailView(generics.DestroyAPIView):
    """
    DELETE: Rimuove una notizia dai salvati. 
    L'utente può eliminare solo i propri salvataggi.
    """
    serializer_class = NewsSalvataSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # Per eliminare cerchiamo sull'ID della notizia, non l'ID del salvataggio, per comodità del frontend
    lookup_field = 'notizia_id'

    def get_queryset(self):
        return NewsSalvata.objects.filter(utente=self.request.user.profilo)
