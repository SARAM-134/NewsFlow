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
        categoria_id = self.request.query_params.get('categoria')
        fonte_id = self.request.query_params.get('fonte')
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
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

        # 1. Configura Gemini per l'embedding della query
        api_key = settings.AI_CONFIG.get('GEMINI_API_KEY')
        if not api_key:
            return Response({"error": "AI non configurata sul server"}, status=500)
        
        try:
            genai.configure(api_key=api_key)
            result = genai.embed_content(
                model="models/gemini-embedding-001",
                content=query,
                task_type="retrieval_query"
            )
            query_embedding = np.array(result['embedding'])

            # 2. Recupera notizie che hanno un embedding
            notizie_con_vettore = Notizia.objects.exclude(vettore_embedding__isnull=True)
            if not notizie_con_vettore.exists():
                return Response({"results": [], "message": "Nessun dato vettoriale disponibile per la ricerca."})

            # 3. Calcolo Similarità (Cosine Similarity)
            results = []
            for notizia in notizie_con_vettore:
                notizia_vec = np.array(notizia.vettore_embedding)
                
                # Formula similarità coseno: (A dot B) / (||A|| * ||B||)
                norm_q = np.linalg.norm(query_embedding)
                norm_n = np.linalg.norm(notizia_vec)
                
                if norm_q > 0 and norm_n > 0:
                    similarity = np.dot(query_embedding, notizia_vec) / (norm_q * norm_n)
                    results.append({
                        'notizia': notizia,
                        'score': float(similarity)
                    })

            # 4. Ordina per score decrescente e prendi i primi 10
            results.sort(key=lambda x: x['score'], reverse=True)
            top_results = results[:10]

            # 5. Serializzazione
            serialized_data = []
            for item in top_results:
                data = NotiziaSerializer(item['notizia'], context={'request': request}).data
                data['similarity_score'] = item['score']
                serialized_data.append(data)

            return Response({
                "query": query,
                "results": serialized_data
            })

        except Exception as e:
            return Response({"error": f"Errore durante la ricerca semantica: {str(e)}"}, status=500)


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
