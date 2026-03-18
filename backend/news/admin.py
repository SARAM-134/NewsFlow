from django.contrib import admin
from .models.categoria import Categoria
from .models.fonte import Fonte
from .models.notizia import Notizia
from .models.tag import Tag

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nome", "slug", "colore")
    prepopulated_fields = {"slug": ("nome",)}

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
