from django.contrib import admin
from .models.newssalvata import NewsSalvata

@admin.register(NewsSalvata)
class NewsSalvataAdmin(admin.ModelAdmin):
    list_display = ('utente', 'notizia', 'salvata_at')
    list_filter = ('salvata_at',)
    search_fields = ('utente__nome', 'utente__cognome', 'notizia__titolo')
    readonly_fields = ('salvata_at',)
