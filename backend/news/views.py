from rest_framework import generics, permissions, filters
from .models.categoria import Categoria
from .models.fonte import Fonte
from .models.notizia import Notizia
from .serializers import CategoriaSerializer, FonteSerializer, NotiziaSerializer
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
