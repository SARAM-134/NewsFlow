from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models.auth import Auth
from .models.utente import Utente


# ─────────────────────────────────────────────
#  Inline per AuthAdmin
# ─────────────────────────────────────────────
class UtenteInline(admin.StackedInline):
    """Permette di vedere e modificare il Profilo (e le Categorie) dentro l'User Admin"""
    model = Utente
    can_delete = False
    verbose_name_plural = 'Profilo Giornalista'
    filter_horizontal = ("categorie_preferite",)

# ─────────────────────────────────────────────
#  AuthAdmin
# ─────────────────────────────────────────────
@admin.register(Auth)
class AuthAdmin(BaseUserAdmin):
    """
    Pannello admin per il modello Auth (custom AbstractBaseUser).
    """
    list_display  = ("email", "username", "is_staff", "is_active", "date_joined")
    list_filter   = ("is_staff", "is_active")
    search_fields = ("email", "username")
    ordering      = ("-date_joined",)

    # Campi visualizzati nella pagina di dettaglio
    fieldsets = (
        (None,           {"fields": ("email", "username", "password")}),
        ("Permessi",     {"fields": ("is_staff", "is_active", "is_superuser",
                                     "groups", "user_permissions")}),
        ("Date",         {"fields": ("date_joined", "last_login")}),
    )

    # Colleghiamo l'inline qui per vedere tutto in una schermata
    inlines = (UtenteInline,)

    # Campi visualizzati nella pagina di creazione
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields":  ("email", "username", "password1", "password2",
                        "is_staff", "is_active"),
        }),
    )


# ─────────────────────────────────────────────
#  UtenteAdmin  (Profilo)
# ─────────────────────────────────────────────
@admin.register(Utente)
class UtenteAdmin(admin.ModelAdmin):
    """
    Pannello admin per il modello Utente (profilo collegato ad Auth).
    I campi di Auth vengono esposti tramite metodi helper.
    """

    # ── colonne helper che leggono dall'oggetto Auth collegato ──
    @admin.display(description="Email", ordering="auth__email")
    def get_email(self, obj):
        return obj.auth.email

    @admin.display(description="Attivo", boolean=True, ordering="auth__is_active")
    def get_is_active(self, obj):
        return obj.auth.is_active

    @admin.display(description="Data registrazione", ordering="auth__date_joined")
    def get_date_joined(self, obj):
        return obj.auth.date_joined

    # ── configurazione pannello ──
    list_display  = ("get_email", "role", "nome", "cognome",
                     "get_is_active", "get_date_joined")
    list_filter   = ("role", "auth__is_active")
    search_fields = ("auth__email", "nome", "cognome")
    ordering      = ("-auth__date_joined",)

    # Campi del form di dettaglio/modifica
    fields = ("auth", "role", "nome", "cognome", "categorie_preferite")
    readonly_fields = ("auth",)
    filter_horizontal = ("categorie_preferite",)
