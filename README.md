# 📰 NewsFlow MVP - Documentazione di Progetto

**NewsFlow** è un aggregatore di notizie intelligente con integrazione AI, progettato per raccogliere feed RSS, riassumerli tramite LLM (es. OpenAI/Gemini) e fornirli agli utenti tramite una moderna interfaccia React e un solido backend in Django REST Framework.

Questo file illustra l'architettura base, la struttura delle cartelle, il modello dei dati, il Contratto API condiviso e la ripartizione dettagliata dei passi operativi e delle responsabilità per ogni ruolo del team.

---

## 🗂️ Struttura delle Cartelle (Monorepo)

Il progetto utilizza una struttura a monorepo, isolando logicamente ed operativamente il layer di frontend da quello di backend.

```text
NewsFlow/
├── .github/
│   └── workflows/          # GitHub Actions per CI/CD (linting, test automatici)
├── backend/                # Progetto web Django + DRF
│   ├── manage.py
│   ├── requirements.txt
│   ├── newsflow_backend/   # Configurazione root Django (settings.py, urls.py, wsgi)
│   ├── accounts/           # Gestione utenti e autenticazione (models Utente, views login/register/logout, permissions)
│   ├── news/               # Gestione notizie, fonti, categorie, tag e ingestion
│   └── demo_fixture.json   # Dump del database popolato per la demo
├── frontend/               # Progetto App React (Vite o CRA)
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── api/            # Istanza base Axios e configurazioni
│       ├── components/     # Componenti isolati (NewsCard, Navbar, Sidebar)
│       ├── constants/      # Variabili condivise, URL base, chiavi di configurazione
│       ├── context/        # React Context (AuthContext per state JWT)
│       ├── hooks/          # Custom hooks condivisi (es. usePagination)
│       ├── pages/          # Viste di pagina (ListaNotizie, Dettaglio, Login, Admin)
│       ├── services/       # Livello service per API (newsService.js)
│       ├── styles/         # CSS Globali e Configurazione Tailwind
│       └── utils/          # Funzioni pure riusabili (es. formatter di date, troncamento testo)
├── docker-compose.yml      # (Opzionale) Setup containers per locale
└── README.md               # Questo documento
```

---

## ⚙️ Variabili d'Ambiente

**Backend (`backend/.env`):**
*   `SECRET_KEY` — Django secret key
*   `DEBUG` — True in locale, False in produzione
*   `ALLOWED_HOSTS` — es. localhost,127.0.0.1
*   `CORS_ALLOWED_ORIGINS` — es. http://localhost:3000
*   `OPENAI_API_KEY` — chiave API per il provider LLM
*   `LLM_PROVIDER` — valore: openai oppure gemini
*   `DB_PATH` — percorso del file SQLite (es. ./db.sqlite3)
*   `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` — durata access token (default: 60)
*   `JWT_REFRESH_TOKEN_LIFETIME_DAYS` — durata refresh token (default: 7)

**Frontend (`frontend/.env`):**
*   `VITE_API_BASE_URL` — es. http://localhost:8000/api
*   `VITE_APP_NAME` — NewsFlow

> **Nota:** Ricordarsi di aggiungere entrambi i file `.env` al `.gitignore` e di fornire i file `.env.example` corrispondenti nella repository.

---

## 🗄️ Struttura del Database (SQLite)

Il modello dati relazionale è progettato per supportare l'aggregazione di notizie e la gestione delle utenze, con accesso differenziato (Lettore, Admin).

### Schema ed Entità Principali

*   **Utente** *(Estensione di `AbstractUser` di Django)*
    *   `id` (PK)
    *   `email` (Unique, usato per il login)
    *   `password` (Hashed)
    *   `ruolo` (Enum o Boolean: Admin / Lettore)
*   **Categoria**
    *   `id` (PK)
    *   `nome` (String, max_length=100, es. "Sport", "Tech")
*   **Fonte**
    *   `id` (PK)
    *   `nome` (String, es. "Reuters", "ANSA")
    *   `url_feed` (String/URL, feed sorgente)
    *   `attiva` (Boolean, default=True) — permette di disabilitare il fetch senza eliminare la fonte
    *   `ultimo_fetch` (DateTime, nullable) — timestamp dell'ultima operazione di ingestion completata, usato dallo scheduler e dal monitoring
    *   `num_errori_consecutivi` (Integer, default=0) — contatore di fallimenti consecutivi; se supera una soglia configurabile (es. 5), la fonte viene disattivata automaticamente
*   **Notizia**
    *   `id` (PK)
    *   `titolo` (String, max_length=255)
    *   `url_originale` (String/URL, formidabile Unique constraint anti-duplicato)
    *   `contenuto_originale` (Text, body originale estratto dal feed)
    *   `data_pubblicazione` (DateTime)
    *   `riassunto_ai` (Text, 3 righe generate da LLM)
    *   `ai_processata` (Boolean, default=False) — flag impostato a True dopo che il riassunto AI e i tag sono stati generati con successo; permette al Management Command di riprendere da dove si era interrotto e all'endpoint Admin di sapere quali notizie sono ancora in coda
    *   `fonte_id` (FK -> Fonte)
    *   `categoria_id` (FK -> Categoria)
    *   `tags` (ManyToManyField -> Tag, blank=True) — relazione M2M verso il modello Tag; Django crea automaticamente la tabella ponte Notizia_Tags
*   **Tag**
    *   `id` (PK)
    *   `nome` (String)

---

## 📡 Contratto API (v1.0)

L'API è esposta in formato RESTful tramite Django REST Framework (DRF) e autenticata con JSON Web Tokens (JWT).

> **Base URL:** `http://localhost:8000/api`  
> **Autenticazione:** Bearer JWT — Header: `Authorization: Bearer <token>`  
> **Content-Type:** `application/json`  
> **Paginazione:** `?page=1&page_size=20` (default page_size: 20, max: 100)

### Sommario Endpoints

| Sezione | Metodo | Endpoint | Autenticazione |
|---|---|---|---|
| **Autenticazione** | POST | `/api/auth/register/` | 🔓 Pubblico |
| | POST | `/api/auth/login/` | 🔓 Pubblico |
| | POST | `/api/auth/token/refresh/` | 🔓 Pubblico (richiede Refresh Token) |
| | POST | `/api/auth/logout/` | 🔒 Lettore & Admin |
| **Notizie** | GET | `/api/notizie/` | 🔒 Lettore & Admin |
| | GET | `/api/notizie/{id}/` | 🔒 Lettore & Admin |
| | DELETE | `/api/notizie/{id}/` | 🔒 Solo Admin |
| | POST | `/api/notizie/{id}/regenerate-ai/`| 🔒 Solo Admin |
| **Categorie** | GET | `/api/categorie/` | 🔒 Lettore & Admin |
| | POST | `/api/categorie/` | 🔒 Solo Admin |
| | PUT | `/api/categorie/{id}/` | 🔒 Solo Admin |
| | DELETE | `/api/categorie/{id}/` | 🔒 Solo Admin |
| **Fonti RSS** | GET | `/api/fonti/` | 🔒 Solo Admin |
| | POST | `/api/fonti/` | 🔒 Solo Admin |
| | PATCH | `/api/fonti/{id}/` | 🔒 Solo Admin |
| | DELETE | `/api/fonti/{id}/` | 🔒 Solo Admin |
| | POST | `/api/fonti/{id}/fetch-now/` | 🔒 Solo Admin |
| **Tag** | GET | `/api/tags/` | 🔒 Lettore & Admin |
| **Utenti** | GET | `/api/utenti/me/` | 🔒 Lettore & Admin |
| | PATCH | `/api/utenti/me/` | 🔒 Lettore & Admin |
| | GET | `/api/utenti/` | 🔒 Solo Admin |
| **Statistiche** | GET | `/api/stats/` | 🔒 Lettore & Admin |
| | GET | `/api/stats/ingestion/` | 🔒 Solo Admin |

### Note Implementative Specifiche per Team

**🔌 Per l'Integratore (React Frontend):**
*   **Gestione Token:** Salvare l'access token in memoria (es. una variabile JS o Context), *mai* in localStorage per ragioni di sicurezza (prevenzione attacchi XSS/CSRF).
*   **Refresh Token:** Può essere salvato lato client con un cookie `HttpOnly` per riaperture future, o accettare la momentanea perdita a reload web per l'MVP.
*   **Interceptor Axios:** Creare routine middleware globale che intercetti l'errore `401 Unauthorized`: tenta il refresh automatico con `/api/auth/token/refresh/` e, in caso fallisca, redirige attivamente l'utente su `/login`.
*   **Headers Type:** Nelle comunicazioni POST/PUT/PATCH associare sempre esplicitamente il content payload `Content-Type: application/json`.
*   **DRF Pagination:** Utilizzare per la list fetching la next flag DRF. Il campo `next` e `previous` contengono l'url assoluto pre-calcolato ed è idoneo associarlo via React Query/Axios.

**⚙️ Per l'Architetto Backend (Django):**
*   **Permessi e Classi Base:** Appoggiare `IsAuthenticated` globalmente per i path di lettura DRF, implementando la sovrascrittura custom `IsAdminUser` dove prescritto dalla classificazione.
*   **Impalcatura CORS:** Specificare e isolare domini attendibili nella CORS Policy: istruire `settings.py` ad autorizzare in array `CORS_ALLOWED_ORIGINS = ['http://localhost:3000']` (o le path usate per hostare l'installato Vite).
*   **Revoca Auth:** L'endpoint di `/logout/` si aspetta che `simplejwt.token_blacklist` sia istallato in `INSTALLED_APPS` (gestendo la cronologia reset nel backend per respingere accessi passibili).
*   **Feed Validations:** Creare validazioni severe: integrare `clean()` form o serializer validator basati su URL regex, testando pure se `feedparser.parse(url).bozo` indica markup XML rotto sul target sorgente.
*   **Ordinamenti ListViews:** Installare nativamente `DjangoFilterBackend`, aggiungendovi SearchFilter nativo appoggiando come fallback query string parameters: `ordering_fields = ['data_pubblicazione', 'titolo']`.

**🤖 Per l'Ingegnere AI/Dati:**
*   **Flag Control System:** Mettere in True `ai_processata` solo e soltanto all'eventuale avvenuto caricamento in Db dei TAGS e RIASSUNTI parsati tramite modello LLM.
*   **Frequenza Risposte Fallaci (LLM Error handling):** Un errore o timeout di servizio OpenAI / Google Gemini NON deve bloccare per alcun modo la creazione della notizia originaria; va effettuato comunque save dell'istanza in base dati senza riassunti per evitare di perdere la wave fetcher (e tenendo il default a False per essere intercettato via job successivo).
*   **Historization Ingestion Sync:** Loggare sempre metriche della fetch-session anche nei TryCatch di bad-timeout; supportarsi attivamente alle logiche d'istanza *exponential-backoff* (1s delay, 2s etc..) nei subrequest di Prompt limit.

---

## 🎯 Guida Passo-Passo per Ruoli (Action Plan - 14 Giorni)

Di seguito la ripartizione tecnica e temporale dei compiti da finalizzare entro i 2 Sprint.

### 🎨 Mago Frontend (UI/UX, Lovable & React)
1.  **Setup Iniziale:** Creazione progetto React/Vite. Setup cartelle, palette colori, e design system (es. Tailwind CSS) mobile-first.
2.  **Skeletons & Mockups:** Disegnare la UI con componenti statici per Lista Notizie (`NewsCard`), Dettaglio Notizia e Navbar.
3.  **UI Login & Form:** Elaborare pagine pulite e professionali per Login/Registrazione, includendo loading states e messaggi di errore.
4.  **Integrazione Dati Reali:** Sostituire progressivamente i dati falsi iniettando state props dinamici; esporre il badge per il "Riassunto AI".
5.  **Dashboard Admin & Ricerca:** Implementare l'Admin panel per operare su Fonti e Categorie; aggiungere la UI per la barra di ricerca.
6.  **Paginazione & Polish Finale:** Chiudere l'UI della paginazione (o infinite scroll), aggiungere filtri combinati, verificare micro-animazioni e dark mode. Frizzare il codice (Code Freeze - GG 10).

### 🔌 Integratore (Logica APIs, Auth Token & Axios)
1.  **Architettura Network:** Creare layer HTTP in `src/api.js` (Axios) per isolare la baseURL e prevedere interceptors validi per il Token JWT.
2.  **Autenticazione Flow:** Gestire form login associandolo all'endpoint di backend; storare in modo sicuro il JWT, implementare il refresh e il `AuthContext`.
3.  **Sync CORS e Policy:** Affiancare il Backend alla definizione del Contratto API e risoluzione delle issue sui CORS domains (incroci localhost).
4.  **Routing & Protezione:** Stilare le rotte pubbliche e protette (`<ProtectedRoute>`). Mappare via Redux/Context o state base le risposte GET `/api/notizie/`.
5.  **Dynamic Filtering e Querys:** Connettere UI input a parametri `?search=X&categoria=Y`, compresa the paginazione su query param.
6.  **Test End-To-End & Tuning:** Evitare render di request multipli (fetch superflue), test persistenza logout, gestire i 401 redirect e prepararsi al freeze isolando fix minori.

### ⚙️ Architetto Backend (Django, SQL, Endpoints)
1.  **Inizializzazione Root:** Avvio `django-admin startproject` web e config in `settings.py`: SQLite base, policy `django-cors-headers` per Integratore, config JWT.
2.  **Model Build:** Definire in `models.py` entità come Utente Custom, Fonte, e Notizia; applicare le `makemigrations`.
3.  **Autenticazione & Permessi:** Agganciare SimpleJWT su `/api/auth/login, /register, /refresh` e limitare permessi `IsAdmin` con Custom DRF Permissions.
4.  **Esposizione Endpoints REST:** Scrivere i serializzatori per validazione (Serializer), le viste CRUD via ViewSet per Fonti e Categorie, e liste sola lettura per i non Admin.
5.  **Ricerca e Pagination:** Includere modulo DRF `PageNumberPagination` e abilitare il `SearchFilter` nativo su stringhe del titolo notizia e riassunto. Ottimizzare le SQL query.
6.  **OpenAPI & Seed:** Redigere la doc su porta Swagger, verificare solidità backend stress testando >500 request, e salvare `python manage.py dumpdata` (Giorno 10).

### 🤖 Ingegnere AI/Dati (Python, Feedparser, LLM Automation)
1.  **Feed Fetcher & Parsing Script:** Montare logica in un Management command Django. Usare `feedparser` per estrarre le feeds originali in batch format normalizzato.
2.  **Prompt Engineering:** Setup API Key provider LLM (OpenAI/Gemini). Stendere system prompts specifici per estrarre stringhe da "Max 3 righe" e array tag "Massimo 3-5 keywords".
3.  **Gestione del Chunking & Anti-Duplicazione:** Validazioni nel codice ingestion che verifichino `Notizia.url_originale` per evitare ripper inserimenti in base dati.
4.  **Gestione Errori Rete LLM:** Codificare blocchi try/catch per gestire robustamente rate-limit exceptions o malformed feeds senza crasciare lo script principale.
5.  **Cron Scheduler:** Affiancare automazione cron (es. Django-Q2, APScheduler) richiamando il command di fetching di default ogni ora in modo trasparente.
6.  **Ottimizzazione Costi vs Demo:** Affinare il costo token, lanciare run per un massive popolamento di 300 entries perfette pre-demo e documentare prompt.

### 🛠️ DevOps & QA (Manager IT, AWS Architecture, Repository)
1.  **Root Setup Control:** Disegnare repository monorepo. Impostare standard naming, rami `develop` / `main` protetti e Github Actions.
2.  **Sync dei Contratti:** Esigere dal team approvazione pre-sviluppo del "Contratto API". Aprire Issue Github/Jira di trackings per i task.
3.  **Testing Core QA:** Creare collection estiva su Postman e gestire sessioni meeting in cui coordinare i test di integrazione integrati fra UI, Network e Backend (Giorno 6 in primis).
4.  **Layer 3 - Architettura Cloud:** Realizzare la simulazione AWS. Diagramma per AWS EC2, allocazione VPC, Relational RDS per DB di stage, IAM Roles e stime di pricing.
5.  **Enforcer Code Freeze:** Impostare tag release (`v1.0-demo`), vietando feature integration post Giorno 10. Prevenire breaking updates prima della riunione board.
6.  **Consegna Deliverable:** Condurre la demo; coordinare tempistiche e Piano B d'emergenza, consegnando GitHub Repo linkata con le stesure complete del progetto.

---

> **Obiettivo Sprint (14 giorni):** Consegnare un prodotto funzionante con live demo, senza interruzioni di blocco, con codice pulito, e dimostrare un'infrastruttura di grado business completa di architetture e automazioni API. Buon lavoro al Team NewsFlow! 🚀