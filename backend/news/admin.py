from django.contrib import admin
from .models.categoria import Categoria
from .models.fonte import Fonte
from .models.notizia import Notizia
from .models.tag import Tag
from django.contrib import messages

@admin.action(description="Genera Briefing AI (Tutte le Categorie)")
def action_genera_briefing(modeladmin, request, queryset):
    from django.core.management import call_command
    
    try:
        # Lancia il comando custom dell'utente 'generate_briefing'
        call_command('generate_briefing')
        modeladmin.message_user(request, "I Briefing sono stati generati con successo tramite lo script!", messages.SUCCESS)
    except Exception as e:
        modeladmin.message_user(request, f"Errore durante la generazione: {str(e)}", messages.WARNING)

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nome", "slug", "colore")
    prepopulated_fields = {"slug": ("nome",)}
    actions = [action_genera_briefing]
    actions = [action_genera_briefing]

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("nome", "slug", "categoria")
    list_filter = ("categoria",)
    search_fields = ("nome",)
    prepopulated_fields = {"slug": ("nome",)}

@admin.register(Fonte)
class FonteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'url_feed', 'tipo', 'attiva')
    list_filter = ('tipo', 'attiva')
    search_fields = ('nome', 'url_feed')
    
@admin.register(Notizia)
class NotiziaAdmin(admin.ModelAdmin):
    list_display = ('titolo', 'fonte', 'categoria', 'data_pubblicazione', 'sentiment_ai')
    list_filter = ('fonte', 'categoria', 'sentiment_ai', 'data_pubblicazione')
    search_fields = ('titolo', 'contenuto')
    date_hierarchy = 'data_pubblicazione'
    filter_horizontal = ('tags',)
    filter_horizontal = ('tags',)
