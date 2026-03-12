from django.contrib import admin
from .models import Utente


@admin.register(Utente)
class UtenteAdmin(admin.ModelAdmin):
    list_display = ("email", "ruolo", "is_active", "data_registrazione")
    list_filter = ("ruolo", "is_active", "settore")
    search_fields = ("email", "nome", "cognome")
    ordering = ("-data_registrazione",)
