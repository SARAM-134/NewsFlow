from django.db import models
from django.utils import timezone


# ─────────────────────────────────────────────
#  CATEGORIA
#  Raggruppa le notizie per argomento (es. Sport, Tech).
#  Usata sia per filtrare le notizie che per associare
#  le Fonti RSS a un tema specifico.
# ─────────────────────────────────────────────
class Categoria(models.Model):
    nome   = models.CharField(max_length=100, unique=True)      # es. "Tecnologia"
    slug   = models.SlugField(max_length=100, unique=True)      # es. "tecnologia" — usato nei filtri URL ?categoria=tecnologia
    colore = models.CharField(max_length=7, default="#3B82F6")   # hex per i badge colorati nel frontend

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorie"
        ordering = ["nome"]                                      # ordine alfabetico di default nelle liste

    def __str__(self):
        return self.nome


# ─────────────────────────────────────────────
#  TAG
#  Parole chiave generate automaticamente dall'AI
#  per ogni notizia. Relazione M2M con Notizia.
#  Non vengono creati manualmente — solo via LLM.
# ─────────────────────────────────────────────
class Tag(models.Model):
    nome = models.CharField(max_length=50, unique=True)      # es. "Intelligenza Artificiale"
    slug = models.SlugField(max_length=50, unique=True)      # es. "intelligenza-artificiale" — usato in ?tag=intelligenza-artificiale

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ["nome"]

    def __str__(self):
        return self.nome


# ─────────────────────────────────────────────
#  FONTE
#  Rappresenta un feed RSS da cui vengono
#  aggregate le notizie. Gestita solo dagli Admin
#  tramite la Dashboard o l'endpoint /api/fonti/.
#
#  Meccanismo di auto-disattivazione:
#    • Ogni fetch fallito incrementa num_errori_consecutivi
#    • Superata la soglia (es. 5), attiva viene settato a False
#    • Un fetch riuscito resetta il contatore a 0
# ─────────────────────────────────────────────
class Fonte(models.Model):
    nome     = models.CharField(max_length=100)               # nome leggibile es. "ANSA Tecnologia"
    url_feed = models.URLField(unique=True)                    # URL del feed RSS — unique per evitare fonti doppie

    # Categoria associata: se eliminata, la fonte rimane ma senza categoria (SET_NULL)
    categoria = models.ForeignKey(
        Categoria, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="fonti"           # related_name permette categoria.fonti.all()
    )

    attiva                 = models.BooleanField(default=True)            # False = fetch sospeso senza eliminare la fonte
    ultimo_fetch           = models.DateTimeField(null=True, blank=True)  # popolato dal Management Command dopo ogni run
    num_errori_consecutivi = models.IntegerField(default=0)               # si azzera a ogni fetch OK, incrementa a ogni errore
                                                                           # se supera la soglia (es. 5) → disattivazione automatica

    class Meta:
        verbose_name = "Fonte"
        verbose_name_plural = "Fonti"
        ordering = ["nome"]

    def __str__(self):
        return self.nome


# ─────────────────────────────────────────────
#  NOTIZIA
#  Entità principale del sistema. Creata solo
#  dal Management Command fetch_news — mai
#  tramite API manuale.
#
#  Ciclo di vita:
#    1. Il fetcher crea la Notizia con ai_processata=False
#    2. Il job AI genera riassunto_ai + tags, poi setta
#       ai_processata=True
#    3. Se il job AI fallisce, la notizia resta salvata
#       senza riassunto → verrà rielaborata al ciclo dopo
# ─────────────────────────────────────────────
class Notizia(models.Model):
    titolo              = models.CharField(max_length=255)
    url_originale       = models.URLField(unique=True)              # UNIQUE = meccanismo anti-duplicati: se l'URL esiste già, skip
    contenuto_originale = models.TextField(blank=True)              # testo grezzo estratto dal feed RSS
    immagine_url        = models.URLField(blank=True, null=True)    # estratta dal campo media:content o enclosure del feed

    data_pubblicazione = models.DateTimeField()                     # data originale dell'articolo sul sito sorgente
    data_ingestion     = models.DateTimeField(default=timezone.now) # quando NOI abbiamo salvato la notizia nel DB

    riassunto_ai       = models.TextField(blank=True, null=True)    # 3 righe generate dal LLM — null finché non processata
    ai_processata      = models.BooleanField(default=False)         # True SOLO dopo che riassunto + tags sono stati salvati con successo
                                                                     # il Management Command usa questo flag per sapere cosa processare

    # Fonte di provenienza: se eliminata, la notizia rimane orfana (SET_NULL) — non si perde
    fonte = models.ForeignKey(
        Fonte, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="notizie"               # related_name permette fonte.notizie.all()
    )

    # Categoria: ereditata solitamente dalla Fonte, ma può essere sovrascritta
    categoria = models.ForeignKey(
        Categoria, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="notizie"               # related_name permette categoria.notizie.all()
    )

    # Relazione M2M con Tag — Django crea automaticamente la tabella ponte "news_notizia_tags"
    # blank=True perché i tag arrivano dopo, in un secondo momento via AI
    tags = models.ManyToManyField(Tag, blank=True, related_name="notizie")

    class Meta:
        verbose_name = "Notizia"
        verbose_name_plural = "Notizie"
        ordering = ["-data_pubblicazione"]                          # le notizie più recenti per prime in tutti i queryset
        # Indici DB per velocizzare le query più frequenti
        indexes = [
            models.Index(                                           # filtrare notizie per categoria + ordine cronologico
                fields=["categoria", "-data_pubblicazione"],
                name="idx_notizia_cat_data",
            ),
            models.Index(                                           # il job AI cerca le notizie con ai_processata=False
                fields=["ai_processata"],
                name="idx_notizia_ai_proc",
            ),
        ]

    def __str__(self):
        return self.titolo

    @property
    def is_pending_ai(self):
        """True se la notizia è in coda per l'elaborazione AI."""
        return not self.ai_processata
