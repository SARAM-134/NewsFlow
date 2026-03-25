from django.urls import path
from .views import (
    CategoriaListView, CategoriaCreateUpdateDeleteView,
    FonteListView, FonteAdminListCreateView, FonteAdminDetailView, FonteFetchNowView,
    NotiziaListView, NotiziaDetailView, NotiziaDeleteView, NotiziaRegenerateAIView,
    SemanticSearchView, TagListView, StatsView, StatsIngestionView
)

urlpatterns = [
    # --- Categorie ---
    path('categorie/', CategoriaListView.as_view(), name='categoria-list'),
    path('categorie/<int:pk>/', CategoriaCreateUpdateDeleteView.as_view(), name='admin-categoria-detail'),

    # --- Fonti ---
    path('fonti/', FonteListView.as_view(), name='fonte-list'),
    path('admin/fonti/', FonteAdminListCreateView.as_view(), name='admin-fonte-list'),
    path('admin/fonti/<int:pk>/', FonteAdminDetailView.as_view(), name='admin-fonte-detail'),
    path('admin/fonti/<int:pk>/fetch/', FonteFetchNowView.as_view(), name='admin-fonte-fetch'),

    # --- Notizie ---
    path('notizie/', NotiziaListView.as_view(), name='notizia-list'),
    path('notizie/search-semantic/', SemanticSearchView.as_view(), name='notizia-semantic-search'),
    path('notizie/<str:url_hash>/', NotiziaDetailView.as_view(), name='notizia-detail'),
    
    # Notizie Admin
    path('admin/notizie/<str:url_hash>/', NotiziaDeleteView.as_view(), name='admin-notizia-delete'),
    path('admin/notizie/<str:url_hash>/regenerate/', NotiziaRegenerateAIView.as_view(), name='admin-notizia-regenerate'),

    # --- Tag ---
    path('tags/', TagListView.as_view(), name='tag-list'),

    # --- Statistiche Admin ---
    path('stats/', StatsView.as_view(), name='admin-stats'),
    path('stats/ingestion/', StatsIngestionView.as_view(), name='admin-stats-ingestion'),
]
