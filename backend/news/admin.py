from django.contrib import admin
from .models.categoria import Categoria
from .models.fonte import Fonte
from .models.notizia import Notizia
from .models.tag import Tag
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 0a7362a (feat: Implement automated news fetching, AI processing, and briefing generation using APScheduler and add an admin action to trigger briefing generation.)
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
<<<<<<< HEAD
=======
>>>>>>> 8c25fe3 (feat: Implement initial News API endpoints, serializers, and URL routing, introduce `NewsSalvata` and `Report` models, and update admin and account migrations.)
=======
>>>>>>> 0a7362a (feat: Implement automated news fetching, AI processing, and briefing generation using APScheduler and add an admin action to trigger briefing generation.)

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nome", "slug", "colore")
    prepopulated_fields = {"slug": ("nome",)}
<<<<<<< HEAD
<<<<<<< HEAD
    actions = [action_genera_briefing]
=======
>>>>>>> 8c25fe3 (feat: Implement initial News API endpoints, serializers, and URL routing, introduce `NewsSalvata` and `Report` models, and update admin and account migrations.)
=======
    actions = [action_genera_briefing]
>>>>>>> 0a7362a (feat: Implement automated news fetching, AI processing, and briefing generation using APScheduler and add an admin action to trigger briefing generation.)

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
<<<<<<< HEAD
<<<<<<< HEAD
    filter_horizontal = ('tags',)
=======
>>>>>>> 8c25fe3 (feat: Implement initial News API endpoints, serializers, and URL routing, introduce `NewsSalvata` and `Report` models, and update admin and account migrations.)
=======
    filter_horizontal = ('tags',)
>>>>>>> dd08fa0 (feat: Implement news tagging functionality, update news sentiment field with choices, and switch news detail lookup to URL hash.)
