from django.contrib import admin
from .models.report import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('utente', 'notizia', 'provider_ai', 'generato_at')
    list_filter = ('provider_ai', 'generato_at')
    search_fields = ('utente__nome', 'utente__cognome', 'notizia__titolo')
    readonly_fields = ('generato_at',)
