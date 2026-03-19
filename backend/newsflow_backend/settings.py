"""
Django settings for newsflow_backend project.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv() # Carica le variabili dal file .env

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "django-insecure-CAMBIA-QUESTA-CHIAVE-IN-PRODUZIONE"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")


# ---------------------------------------------------------------------------
#  INSTALLED APPS
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # --- Third-party ---
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",   # per logout / revoca token
    "corsheaders",
    # --- App locali ---
    "accounts",
    "news",
    "reports",
    "interactions",
]


# ---------------------------------------------------------------------------
#  MIDDLEWARE
# ---------------------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",           # CORS — deve stare PRIMA di CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "newsflow_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "newsflow_backend.wsgi.application"


# ---------------------------------------------------------------------------
#  DATABASE — SQLite per l'MVP
# ---------------------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / os.environ.get("DB_PATH", "db.sqlite3"),
    }
}


# ---------------------------------------------------------------------------
#  AUTH — Modello utente custom
# ---------------------------------------------------------------------------
AUTH_USER_MODEL = "accounts.Auth"     # ⚠️ OBBLIGATORIO prima della prima migrate

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ---------------------------------------------------------------------------
#  INTERNAZIONALIZZAZIONE
# ---------------------------------------------------------------------------
LANGUAGE_CODE = "it"
TIME_ZONE = "Europe/Rome"
USE_I18N = True
USE_TZ = True


# ---------------------------------------------------------------------------
#  FILE STATICI E MEDIA
# ---------------------------------------------------------------------------
# URL per i file statici (CSS, JS, immagini del sito)
STATIC_URL = "static/"
# URL pubblico per accedere ai file caricati dagli utenti (es. immagini notizie)
MEDIA_URL = "media/"
# Percorso fisico nel filesystem dove Django salverà i file caricati
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ---------------------------------------------------------------------------
#  CORS — domini autorizzati per il frontend React
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")


# ---------------------------------------------------------------------------
#  DJANGO REST FRAMEWORK
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": [
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}


# ---------------------------------------------------------------------------
#  SIMPLE JWT
# ---------------------------------------------------------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(os.environ.get("JWT_ACCESS_TOKEN_LIFETIME_MINUTES", 60))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=int(os.environ.get("JWT_REFRESH_TOKEN_LIFETIME_DAYS", 7))
    ),
    "ROTATE_REFRESH_TOKENS": True,          # ogni refresh genera un nuovo refresh token
    "BLACKLIST_AFTER_ROTATION": True,       # il vecchio refresh viene invalidato
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ---------------------------------------------------------------------------
#  CONFIGURAZIONE EMAIL E FRONTEND (Reset Password)
# ---------------------------------------------------------------------------
PASSWORD_RESET_FRONTEND_URL = os.environ.get(
    "PASSWORD_RESET_FRONTEND_URL", 
    "http://localhost:3000/reset-password/"
)

EMAIL_BACKEND = os.environ.get(
    "EMAIL_BACKEND", 
    "django.core.mail.backends.console.EmailBackend" # Stampa in console di default per sviluppo locale
)
EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "tuamail@gmail.com")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "latuapassword")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# ---------------------------------------------------------------------------
#  AI CONFIGURATION (Gemini / LLM)
# ---------------------------------------------------------------------------
AI_CONFIG = {
    "GEMINI_API_KEY": os.environ.get("GEMINI_API_KEY", ""),
    "MODEL_NAME": os.environ.get("AI_MODEL_NAME", "gemini-flash-latest"),
    "MAX_LINES_SUMMARY": 3,
}
