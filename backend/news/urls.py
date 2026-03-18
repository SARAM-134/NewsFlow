from django.urls import path
from .views import CategoriaListView, FonteListView, NotiziaListView, NotiziaDetailView

urlpatterns = [
    # Rotte per Fonti e Categorie
    path('categorie/', CategoriaListView.as_view(), name='categoria-list'),
    path('fonti/', FonteListView.as_view(), name='fonte-list'),
    
    # Rotte pubbliche per le Notizie
    path('notizie/', NotiziaListView.as_view(), name='notizia-list'),
<<<<<<< HEAD
    path('notizie/<str:url_hash>/', NotiziaDetailView.as_view(), name='notizia-detail'),
=======
    path('notizie/<int:pk>/', NotiziaDetailView.as_view(), name='notizia-detail'),
>>>>>>> 8c25fe3 (feat: Implement initial News API endpoints, serializers, and URL routing, introduce `NewsSalvata` and `Report` models, and update admin and account migrations.)
]
