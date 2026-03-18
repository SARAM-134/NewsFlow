from rest_framework import generics, permissions, filters
from .models.categoria import Categoria
from .models.fonte import Fonte
from .models.notizia import Notizia
from .serializers import CategoriaSerializer, FonteSerializer, NotiziaSerializer

# --- VISTE PUBBLICHE (Lettura per tutti) ---
class CategoriaListView(generics.ListAPIView):
    """Ritorna tutte le categorie disponibili."""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]

class FonteListView(generics.ListAPIView):
    """Ritorna tutte le fonti, filtrabili solo per quelle attive."""
    queryset = Fonte.objects.filter(attiva=True)
    serializer_class = FonteSerializer
    permission_classes = [permissions.AllowAny]

class NotiziaListView(generics.ListAPIView):
    """
    Lista delle notizie con supporto per:
    - Ricerca testuale (?search=parola)
    - Ordinamento (?ordering=-data_pubblicazione)
    - Filtro per categoria (?categoria=ID)
    - Filtro per fonte (?fonte=ID)
    """
    serializer_class = NotiziaSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titolo', 'contenuto', 'extract_ai']
    ordering_fields = ['data_pubblicazione']
    ordering = ['-data_pubblicazione']

    def get_queryset(self):
<<<<<<< HEAD
        queryset = Notizia.objects.select_related('categoria', 'fonte').prefetch_related('tags').all()
=======
        queryset = Notizia.objects.select_related('categoria', 'fonte').all()
>>>>>>> 8c25fe3 (feat: Implement initial News API endpoints, serializers, and URL routing, introduce `NewsSalvata` and `Report` models, and update admin and account migrations.)
        
        # Filtri custom via Query Params
        categoria_id = self.request.query_params.get('categoria')
        fonte_id = self.request.query_params.get('fonte')
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        if fonte_id:
            queryset = queryset.filter(fonte_id=fonte_id)
            
        return queryset

class NotiziaDetailView(generics.RetrieveAPIView):
<<<<<<< HEAD
    queryset = Notizia.objects.select_related('categoria', 'fonte').prefetch_related('tags').all()
    serializer_class = NotiziaSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'url_hash' 
=======
    """Visualizza il dettaglio di una singola notizia."""
    queryset = Notizia.objects.select_related('categoria', 'fonte').all()
    serializer_class = NotiziaSerializer
    permission_classes = [permissions.AllowAny]

# Nota: per la creazione via Web Scraper non esponiamo form pubblici.
# Lo scraper userà comandi interni o API key specifiche (implementabili in futuro).
>>>>>>> 8c25fe3 (feat: Implement initial News API endpoints, serializers, and URL routing, introduce `NewsSalvata` and `Report` models, and update admin and account migrations.)
