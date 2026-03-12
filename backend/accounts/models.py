from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


# ─────────────────────────────────────────────
#  UTENTE MANAGER
#  Manager custom obbligatorio quando si rimuove
#  il campo username da AbstractUser, altrimenti
#  createsuperuser e create_user non funzionano.
# ─────────────────────────────────────────────
class UtenteManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email è obbligatoria")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("ruolo", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


# ─────────────────────────────────────────────
#  UTENTE
#  Modello utente custom che usa l'email come
#  campo di login al posto di username.
#  Estende AbstractUser di Django.
# ─────────────────────────────────────────────
class Utente(AbstractUser):

    RUOLI = [
        ("admin", "Admin"),
        ("lettore", "Lettore"),
    ]

    SETTORI = [
        ("cronaca",      "Cronaca"),
        ("politica",     "Politica"),
        ("economia",     "Economia"),
        ("tecnologia",   "Tecnologia"),
        ("sport",        "Sport"),
        ("cultura",      "Cultura"),
        ("esteri",       "Esteri"),
        ("food",         "Food"),
        ("scienza",      "Scienza"),
        ("altro",        "Altro"),
    ]

    # --- campi base ---
    username   = None                                                   # rimosso: usiamo email come login
    email      = models.EmailField(unique=True)                         # campo di login principale
    ruolo      = models.CharField(max_length=10, choices=RUOLI, default="lettore")

    # --- dati profilo ---
    nome       = models.CharField(max_length=100, blank=True)
    cognome    = models.CharField(max_length=100, blank=True)
    settore    = models.CharField(max_length=20, choices=SETTORI,
                                   blank=True, null=True)               # settore di interesse del giornalista

    # --- 2FA ---
    telefono              = models.CharField(max_length=20, blank=True, null=True, unique=True)
    telefono_verificato   = models.BooleanField(default=False)          # True dopo verifica OTP
    otp_secret            = models.CharField(max_length=64, blank=True, null=True)  # seed TOTP/HOTP

    # --- stato account ---
    is_active             = models.BooleanField(default=True)
    data_registrazione    = models.DateTimeField(auto_now_add=True)
    ultimo_accesso_ip     = models.GenericIPAddressField(null=True, blank=True)  # audit e sicurezza

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = []                                                # email e password sono già richiesti
    objects         = UtenteManager()

    class Meta:
        verbose_name        = "Utente"
        verbose_name_plural = "Utenti"
        ordering            = ["-data_registrazione"]

    def __str__(self):
        return f"{self.email} ({self.get_ruolo_display()})"

    @property
    def nome_completo(self):
        """Restituisce 'Nome Cognome' oppure l'email se entrambi sono vuoti."""
        return f"{self.nome} {self.cognome}".strip() or self.email