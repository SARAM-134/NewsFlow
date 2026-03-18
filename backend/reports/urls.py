from django.urls import path
from .views import ReportListCreateView, ReportDetailView

urlpatterns = [
    # Rotta base: /api/reports/
    path('', ReportListCreateView.as_view(), name='report_list_create'),
    # Rotta singola: /api/reports/<id>/
    path('<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
]
