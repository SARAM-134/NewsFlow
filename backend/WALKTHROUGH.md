# Resoconto Tecnico: Refactoring e Implementazione NewsFlow (Backend)

Oggi abbiamo completato un'importante ristrutturazione architetturale del backend di NewsFlow, passando da una struttura iniziale acerba a un ecosistema di livello Enterprise, modulare e pronto per essere scalato.

Ecco in dettaglio tutto ciò che è stato realizzato per allinearci al nuovo Database Schema fornito via PDF.

## 1. Riorganizzazione in 4 App Indipendenti (Decoupling)
Abbiamo applicato il principio di **Singola Responsabilità (SRP)**, dividendo il monolito in quattro app Django distinte. Questo garantisce che se una parte crolla o va modificata pesantemente, le altre non ne risentono.

* **`accounts`**: Gestisce esclusivamente l'autenticazione, la sicurezza e le identità.
* **`news`**: Il "cuore" del prodotto, contenente i feed, le categorie e gli articoli fisici.
* **`interactions`**: Un modulo autonomo per tutte le azioni umane (attualmente per i "Salvati", ma pronto ad accogliere i futuri "Mi Piace" o "Commenti" senza sporcare l'app news).
* **`reports`**: Modulo dedicato all'intelligenza artificiale e alla generazione dei briefing testuali.

## 2. Implementazione Dettagliata per App

### 📦 App `accounts`
Abbiamo sdoppiato la gestione degli utenti per massima flessibilità:
* **Modelli Separati**: Un modello `Auth` (base ultra-sicura per email e password crittografata) e un modello collegato 1-a-1 `Utente` (contenente Nome, Cognome e Ruolo come "giornalista" o "admin").
* **Registrazione**: È aperta, ma chiunque si registri via API ottiene di default il ruolo sicuro di "giornalista". Nessuno può auto-promuoversi admin da API.
* **Autenticazione JWT Superiore**: Abbiamo personalizzato la generazione del token JWT (JSON Web Token) in modo che contenga già codificato al suo interno il `role` dell'utente. Il Frontend non dovrà più fare mille chiamate per capire se mostrare o meno il pannello admin all'accesso.
* **Password Reset**: Predisposte le rotte e i Serializer per il reset della password tramite l'invio fisico di email usando token sicuri univoci di uso singolo (`/password-reset/` e `/password-reset-confirm/`).
* **Soft Delete**: Se un Amministratore elimina un Giornalista dal pannello, quest'ultimo non viene cancellato fisicamente dal database (evitando la perdita a cascata di tutto il suo storico salvataggi e report), ma viene applicato un *Soft Delete* (`is_active = False`), impedendogli solo il login.

### 📰 App `news` (Core)
Abbiamo sincronizzato il ramo includendo i modelli scritti su `main` e li abbiamo "accesi":
* I modelli `Categoria`, `Fonte`, `Notizia` e `Tag` sono stati corredati dai rispettivi **Serializers**.
* **Ottimizzazione Lettura**: Il `NotiziaSerializer` non stampa solo anonimi ID, ma include oggetti nidificati di Categoria e Fonte (Minimal Serializers) per far risparmiare lavoro al frontend ("ti do l'articolo e ti dico già come si chiama la fonte, non cercartela").
* **Vista Pubblica Avanzata**: La rotta per la lista delle notizie permette nativamente il Text Search, l'Ordinamento e i Filtri per categoria/fonte (es: `/api/notizie/?search=roma&categoria=2`).
* **Pannello Admin**: Migliorato con la compilazione automatica intelligente degli slug (scrivi il nome e lo slug si genera da solo a schermo).

### 🤝 App `interactions`
* **Modello `NewsSalvata`**: Implementato come *Tabella Pivot* perfetta. Collega lo storico dell'utente allo storico della notizia. 
* Contiene un vincolo antiduplicato lato DB (`unique_together`) per impedire anomalie di rete dove l'utente clicca freneticamente salva 3 volte e la riga si sdoppia.
* Viste per far richiedere a un utente loggato **unicamente** la propria lista dei salvati (sicurezza della privacy).

### 🤖 App `reports`
* **Modello `Report`**: Costruito per legare la richiesta AI al Giornalista e all'Articolo, memorizzando al suo interno il tipo di fornitore dell'IA (OpenAI, Gemini, Anthropic) e il testo completo per l'utilizzo futuro.

## 3. Infrastruttura e Database
* **Connessione API Globali**: Architettura di routing basata sugli standard REST (`/api/auth/`, `/api/news/`, `/api/interactions/`, `/api/reports/`).
* **Clean Database**: Essendo l'architettura dei dati molto sfalsata rispetto a vecchie prove passate, si è optato per la cancellazione del vecchio file `db.sqlite3` sporco.
* Abbiamo rigenerato tutti i file di migrazione (da 0) per tutte e 4 le app e le abbiamo propagate con successo sul nuovo DB immacolato, abbattendo ogni alert e debito tecnico.

---
**Status Attuale del Progetto:** Backend saldamente in piedi. Modelli logici e database allineati al 100%. Endpoint API JSON funzionanti e pronti per essere agganciati al Frontend in React o per essere testati tramite Postman.
