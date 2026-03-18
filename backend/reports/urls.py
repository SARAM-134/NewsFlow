from django.urls import path
<<<<<<< HEAD
from .views import (
    ReportListCreateView, 
    ReportDetailView,
    BriefingListView,
    MyBriefingsView
)

urlpatterns = [
    # Rotte Report (notizie singole)
    path('', ReportListCreateView.as_view(), name='report_list_create'),
    path('<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    
    # Rotte Briefing (multi-notizia per categoria)
    path('briefings/', BriefingListView.as_view(), name='briefing_list'),
    path('my-briefings/', MyBriefingsView.as_view(), name='my_briefings'),
=======
from .views import ReportListCreateView, ReportDetailView

urlpatterns = [
    # Rotta base: /api/reports/
    path('', ReportListCreateView.as_view(), name='report_list_create'),
    # Rotta singola: /api/reports/<id>/
    path('<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
>>>>>>> 52d5fd0 (feat: add reports module with models, serializers, views, and API endpoints for managing AI-generated reports.)
]
