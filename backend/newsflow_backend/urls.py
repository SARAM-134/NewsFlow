"""
newsflow_backend URL Configuration

Il routing principale delega alle singole app:
  /admin/        → Django Admin
  /api/auth/     → accounts (login, register, refresh, logout)
  /api/          → news     (notizie, categorie, fonti, tags)
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    # Le app registreranno i propri URL nei rispettivi urls.py
    # path("api/auth/", include("accounts.urls")),
    # path("api/", include("news.urls")),
]
