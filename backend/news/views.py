from rest_framework import generics, permissions, filters, status
from accounts.views import IsAdminRole
from .models.categoria import Categoria
from .models.fonte import Fonte
from .models.notizia import Notizia
from .models.tag import Tag
from .serializers import CategoriaSerializer, FonteSerializer, NotiziaSerializer, TagSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
import numpy as np
from django.conf import settings
import google.generativeai as genai

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
    Lista delle notizie.
    """
    serializer_class = NotiziaSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titolo', 'contenuto_originale', 'extract_ai']
    ordering_fields = ['data_pubblicazione']
    ordering = ['-data_pubblicazione']

    def get_queryset(self):
        queryset = Notizia.objects.select_related('categoria', 'fonte').prefetch_related('tags').all()
        
        # Filtri custom via Query Params
        categoria_ids = self.request.query_params.get('categoria')
        fonte_id = self.request.query_params.get('fonte')
        
        if categoria_ids:
            # Supporta categoria=1 o categoria=1,2,3
            ids = [id.strip() for id in categoria_ids.split(',') if id.strip().isdigit()]
            if ids:
                queryset = queryset.filter(categoria_id__in=ids)
        
        if fonte_id:
            queryset = queryset.filter(fonte_id=fonte_id)
            
        return queryset

class NotiziaDetailView(generics.RetrieveAPIView):
    queryset = Notizia.objects.select_related('categoria', 'fonte').prefetch_related('tags').all()
    serializer_class = NotiziaSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'url_hash'


# --- RICERCA SEMANTICA (AI) ---
class SemanticSearchView(APIView):
    """
    POST: Riceve una query testuale 'q' e restituisce le notizie più simili
    utilizzando gli embedding vettoriali generati dall'AI.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"error": "Parametro 'q' mancante"}, status=400)

        try:
            from .ai_utils import get_embedding_standard
            embedding_list = get_embedding_standard(query)
            
            if not embedding_list:
                return self.keyword_search_fallback(query, request)
            
            query_embedding = np.array(embedding_list)

            # 2. Recupera notizie che hanno un embedding
            # Carichiamo solo i campi necessari per velocità
            notizie_qs = Notizia.objects.exclude(vettore_embedding__isnull=True).only('id', 'vettore_embedding')
            
            if not notizie_qs.exists():
                return self.keyword_search_fallback(query, request)

            # 3. Calcolo Similarità massivo con Numpy (Ottimizzato)
            # Estraggono tutti i vettori in una matrice
            vectors = []
            valid_ids = []
            for n in notizie_qs:
                if n.vettore_embedding and len(n.vettore_embedding) == len(query_embedding):
                    vectors.append(n.vettore_embedding)
                    valid_ids.append(n.id)
            
            if not vectors:
                return self.keyword_search_fallback(query, request)

            # Trasformiamo in array numpy
            matrix = np.array(vectors) # (N, Dim)
            
            # Normalizzazione query
            norm_q = np.linalg.norm(query_embedding)
            if norm_q == 0: return self.keyword_search_fallback(query, request)
            
            # Normalizzazione matrice (lungo l'asse degli embedding)
            norms_n = np.linalg.norm(matrix, axis=1)
            
            # Calcolo similarità coseno vettorializzato: (Matrix @ q) / (norms_n * norm_q)
            # Evitiamo divisioni per zero
            norms_n[norms_n == 0] = 1.0
            similarities = np.dot(matrix, query_embedding) / (norms_n * norm_q)

            # 4. Associa ID e Score e ordina
            score_map = {valid_ids[i]: float(similarities[i]) for i in range(len(valid_ids))}
            
            # Recupera le notizie reali ordinate per score (limit 15)
            top_ids = sorted(score_map, key=score_map.get, reverse=True)[:15]
            top_notizie = Notizia.objects.filter(id__in=top_ids).select_related('categoria', 'fonte').prefetch_related('tags')
            
            # Manteniamo l'ordine dello score
            sorted_results = sorted(
                top_notizie, 
                key=lambda x: score_map.get(x.id, 0), 
                reverse=True
            )

            # 5. Serializzazione
            serialized_data = []
            for notizia in sorted_results:
                data = NotiziaSerializer(notizia, context={'request': request}).data
                data['similarity_score'] = score_map.get(notizia.id, 0)
                serialized_data.append(data)

            return Response({
                "query": query,
                "results": serialized_data,
                "type": "semantic",
                "count": len(serialized_data)
            })

        except Exception as e:
            print(f"Errore Ricerca Semantica: {e}")
            return self.keyword_search_fallback(query, request)

    def keyword_search_fallback(self, query, request):
        """Ricerca tradizionale basata su keywords se l'AI fallisce."""
        from django.db.models import Q
        notizie = Notizia.objects.filter(
            Q(titolo__icontains=query) | 
            Q(contenuto_originale__icontains=query) |
            Q(extract_ai__icontains=query)
        ).select_related('categoria', 'fonte')[:15]
        
        serialized_data = NotiziaSerializer(notizie, many=True, context={'request': request}).data
        for item in serialized_data:
            item['similarity_score'] = 1.0 # Score fittizio
            
        return Response({
            "query": query,
            "results": serialized_data,
            "type": "keyword_fallback"
        })


# --- VISTE ADMIN (Gestione Contenuti) ---

class CategoriaCreateUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """Admin CRUD per una singola categoria."""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminRole]

class FonteAdminListCreateView(generics.ListCreateAPIView):
    """Admin lista e creazione fonti."""
    queryset = Fonte.objects.all()
    serializer_class = FonteSerializer
    permission_classes = [IsAdminRole]

class FonteAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin gestione singola fonte."""
    queryset = Fonte.objects.all()
    serializer_class = FonteSerializer
    permission_classes = [IsAdminRole]

class FonteFetchNowView(APIView):
    """Admin trigger fetch manuale su una fonte."""
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            fonte = Fonte.objects.get(pk=pk)
            # Iniziamo un fetch asincrono o sincrono? Per ora sincrono per semplicità nel test
            from django.core.management import call_command
            # Nota: usiamo --limit per non bloccare troppo la richiesta HTTP
            call_command('fetch_news', limit=5)
            return Response({"message": f"Fetch avviato per {fonte.nome}"}, status=status.HTTP_200_OK)
        except Fonte.DoesNotExist:
            return Response({"error": "Fonte non trovata"}, status=status.HTTP_404_NOT_FOUND)

class NotiziaDeleteView(generics.DestroyAPIView):
    """Admin eliminazione notizia."""
    queryset = Notizia.objects.all()
    serializer_class = NotiziaSerializer
    permission_classes = [IsAdminRole]
    lookup_field = 'url_hash'

class NotiziaRegenerateAIView(APIView):
    """Admin rigenera riassunto AI per una notizia."""
    permission_classes = [IsAdminRole]

    def post(self, request, url_hash):
        try:
            notizia = Notizia.objects.get(url_hash=url_hash)
            # Resettiamo e forziamo l'elaborazione
            notizia.ai_processata = False
            notizia.save()
            
            from django.core.management import call_command
            # Chiamiamo process_ai solo per questo articolo?
            # Per ora lanciamo il comando globale che prenderà questo (e altri pendenti)
            call_command('process_ai', limit=5)
            
            return Response({"message": "Elaborazione AI riavviata."}, status=status.HTTP_200_OK)
        except Notizia.DoesNotExist:
            return Response({"error": "Notizia non trovata"}, status=status.HTTP_404_NOT_FOUND)

class TagListView(generics.ListAPIView):
    """Ritorna tutti i tag (almeno per utenti registrati)."""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]


# --- VISTE STATISTICHE (Dashboard Admin) ---

class StatsView(APIView):
    """GET: Statistiche generali del catalogo news."""
    permission_classes = [IsAdminRole]

    def get(self, request):
        from django.db.models import Count
        
        total_notizie = Notizia.objects.count()
        per_categoria = Notizia.objects.values('categoria__nome').annotate(count=Count('id')).order_by('-count')
        fonti_attive = Fonte.objects.filter(attiva=True).count()
        notizie_ai = Notizia.objects.filter(ai_processata=True).count()

        return Response({
            "total_notizie": total_notizie,
            "notizie_elaborate_ai": notizie_ai,
            "fonti_attive": fonti_attive,
            "notizie_per_categoria": per_categoria
        })

class StatsIngestionView(APIView):
    """GET: Dettagli tecnici sull'ingestion delle fonti (per admin)."""
    permission_classes = [IsAdminRole]

    def get(self, request):
        fonti = Fonte.objects.all().values(
            'nome', 'ultimo_fetch', 'num_errori_consecutivi', 'attiva'
        ).order_by('-ultimo_fetch')

        return Response({
            "ingestion_status": fonti
        })
