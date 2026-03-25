import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importiamo le pagine
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // Assicurati che questo file esista e sia corretto
import DashboardPage from './pages/DashboardPage';

function App() {
  const scrollRef = useRef(null);

  const [notizie, setNotizie] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNotizie();
        const articles = data.results || data;

        const mappedArticles = articles.map(n => ({
          id: n.id,
          categoria: n.categoria_dettaglio?.nome || "NEWS",
          themeColor: n.categoria_dettaglio?.colore || "#000000",
          titolo: n.titolo,
          riassunto: n.extract_ai || (n.contenuto_originale || "").substring(0, 100) + '...',
          immagine: n.immagine_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500",
          sentiment: n.sentiment_ai || "neutrale",
          textColor: n.sentiment_ai === "positivo" ? "text-green-500" : n.sentiment_ai === "negativo" ? "text-red-500" : "text-gray-500"
        }));

        setNotizie(mappedArticles);
      } catch (err) {
        console.error("Errore nel caricamento notizie", err);
      } finally {
        setLoading(false);
      }
    };

    // Caricamento iniziale
    fetchNews();

    // Polling automatico ogni 30 secondi per vedere i nuovi dati elaborati dall'AI
    const intervalId = setInterval(fetchNews, 30000);

    // Cleanup: ferma il polling quando il componente viene smontato
    return () => clearInterval(intervalId);
  }, []);

  // Configurazione Dinamica per la Sezione DEEP FLOW (Scegli il tema qui)
  const [temaDeepFlow, setTemaDeepFlow] = useState({
    titoloSottile: "CULTURE", // Titolo a destra
    coloreTema: "text-pink-500", // Colore per "Essenza del Flusso" e pulsante (Rosa per Cultura)
    testoTitolo: "La riscoperta delle tradizioni <span class='font-medium text-gray-950'>guida</span> il nuovo rinascimento creativo.",
    testoDescrizione: "L'analisi mostra un forte interesse per le radici storiche: l'85% degli utenti interagisce con contenuti d'arte digitale."
  });

  const scroll = (direction) => {
    if (direction === 'left') scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    else scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <Router>
      <Routes>
        {/* Rotta Principale (Home) */}
        <Route path="/" element={<HomePage />} />

        {/* Rotta Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotta Dashboard (Protetta in futuro) */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
