from django.urls import path
from .views import NewsSalvataListCreateView, NewsSalvataDetailView

urlpatterns = [
    # Rotta base: /api/interactions/saved/
    path('saved/', NewsSalvataListCreateView.as_view(), name='saved_news_list_create'),
    # Rotta per eliminazione: /api/interactions/saved/<notizia_id>/
    path('saved/<int:notizia_id>/', NewsSalvataDetailView.as_view(), name='saved_news_delete'),
]
