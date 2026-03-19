from django.urls import path
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ffa555f (feat: Implement reports module, user registration, profile management, and password reset functionalities.)
from .views import (
    ReportListCreateView, 
    ReportDetailView,
    BriefingListView,
    MyBriefingsView
)
<<<<<<< HEAD

urlpatterns = [
    # Rotte Report (notizie singole)
    path('', ReportListCreateView.as_view(), name='report_list_create'),
    path('<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    
    # Rotte Briefing (multi-notizia per categoria)
    path('briefings/', BriefingListView.as_view(), name='briefing_list'),
    path('my-briefings/', MyBriefingsView.as_view(), name='my_briefings'),
=======
from .views import ReportListCreateView, ReportDetailView
=======
>>>>>>> ffa555f (feat: Implement reports module, user registration, profile management, and password reset functionalities.)

urlpatterns = [
    # Rotte Report (notizie singole)
    path('', ReportListCreateView.as_view(), name='report_list_create'),
    path('<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
<<<<<<< HEAD
>>>>>>> 52d5fd0 (feat: add reports module with models, serializers, views, and API endpoints for managing AI-generated reports.)
=======
    
    # Rotte Briefing (multi-notizia per categoria)
    path('briefings/', BriefingListView.as_view(), name='briefing_list'),
    path('my-briefings/', MyBriefingsView.as_view(), name='my_briefings'),
>>>>>>> ffa555f (feat: Implement reports module, user registration, profile management, and password reset functionalities.)
]
