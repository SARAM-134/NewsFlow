from django.urls import path
from .views import CategoriaListView, FonteListView, NotiziaListView, NotiziaDetailView

urlpatterns = [
    # Rotte per Fonti e Categorie
    path('categorie/', CategoriaListView.as_view(), name='categoria-list'),
    path('fonti/', FonteListView.as_view(), name='fonte-list'),
    
    # Rotte pubbliche per le Notizie
    path('notizie/', NotiziaListView.as_view(), name='notizia-list'),
    path('notizie/<int:pk>/', NotiziaDetailView.as_view(), name='notizia-detail'),
]
