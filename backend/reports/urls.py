from django.urls import path
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

urlpatterns = [
    # Rotte Report (notizie singole)
    path('', ReportListCreateView.as_view(), name='report_list_create'),
    path('<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    
    # Rotte Briefing (multi-notizia per categoria)
    path('briefings/', BriefingListView.as_view(), name='briefing_list'),
    path('my-briefings/', MyBriefingsView.as_view(), name='my_briefings'),
]
