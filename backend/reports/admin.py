from django.contrib import admin
from .models import Report, Briefing

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('utente', 'notizia', 'provider_ai', 'generato_at')
    list_filter = ('provider_ai', 'generato_at')
    search_fields = ('utente__nome', 'utente__cognome', 'notizia__titolo')
    readonly_fields = ('generato_at',)

@admin.register(Briefing)
class BriefingAdmin(admin.ModelAdmin):
    list_display = ('titolo', 'categoria', 'data_creazione')
    list_filter = ('categoria', 'data_creazione')
    search_fields = ('titolo', 'contenuto')
    readonly_fields = ('data_creazione',)
