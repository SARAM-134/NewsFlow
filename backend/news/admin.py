from django.contrib import admin
from .models import Categoria, Tag, Fonte, Notizia


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nome", "slug", "colore")
    prepopulated_fields = {"slug": ("nome",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("nome", "slug")
    prepopulated_fields = {"slug": ("nome",)}


@admin.register(Fonte)
class FonteAdmin(admin.ModelAdmin):
    list_display = ("nome", "url_feed", "categoria", "attiva", "ultimo_fetch", "num_errori_consecutivi")
    list_filter = ("attiva", "categoria")
    search_fields = ("nome", "url_feed")


@admin.register(Notizia)
class NotiziaAdmin(admin.ModelAdmin):
    list_display = ("titolo", "fonte", "categoria", "data_pubblicazione", "ai_processata")
    list_filter = ("ai_processata", "categoria", "fonte")
    search_fields = ("titolo", "contenuto_originale")
    filter_horizontal = ("tags",)          # widget comodo per i tag M2M
    ordering = ("-data_pubblicazione",)
