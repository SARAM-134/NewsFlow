import React, { useRef, useState, useEffect } from 'react';
import { getNotizie } from '../services/api';
import Navbar from '../components/Navbar';
import InputBar from '../components/InputBar';
import NewsCard from '../components/NewsCard';

function HomePage() {
  const scrollRef = useRef(null);
  const [notizie, setNotizie] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carichiamo le categorie disponibili
    const fetchCategories = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        const res = await fetch(`${baseUrl}/categorie/`);
        if (res.ok) {
          const data = await res.json();
          setCategorie(data.results || data);
        }
      } catch (error) {
        console.error("Errore caricamento categorie:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Passiamo il filtro categoria se selezionato
        const params = selectedCategory ? { categoria: selectedCategory } : {};
        const data = await getNotizie(params);
        
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
    fetchNews();
  }, [selectedCategory]); // Ricarica quando cambia la categoria

  // Configurazione Dinamica per la Sezione DEEP FLOW
  const [temaDeepFlow, setTemaDeepFlow] = useState({
    titoloSottile: "CULTURE",
    coloreTema: "text-pink-500",
    testoTitolo: "La riscoperta delle tradizioni <span class='font-medium text-gray-950'>guida</span> il nuovo rinascimento creativo.",
    testoDescrizione: "L'analisi mostra un forte interesse per le radici storiche: l'85% degli utenti interagisce con contenuti d'arte digitale."
  });

  const scroll = (direction) => {
    if (direction === 'left') scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    else scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <InputBar />

        {/* --- FILTRI CATEGORIE --- */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {categorie.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                selectedCategory === cat.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>

        {/* --- SEZIONE 1: DAILY BREAKING --- */}
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl tracking-[-0.04em] text-gray-900 uppercase">
              <span className="font-light">DAILY</span> <span className="font-bold">BREAKING</span>
            </h2>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <div className="relative group">
            <button onClick={() => scroll('left')} className="absolute left-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">←</button>
            <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 px-2 scroll-smooth">
              {loading ? (
                <div className="text-gray-400 font-light italic">Caricamento in corso dal Database...</div>
              ) : notizie.length > 0 ? (
                notizie.map((n) => <NewsCard key={n.id} {...n} />)
              ) : (
                <div className="text-gray-400 font-light italic">Nessuna notizia trovata nel Database.</div>
              )}
            </div>
            <button onClick={() => scroll('right')} className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">→</button>
          </div>
        </section>

        {/* --- SEZIONE 2: DEEP FLOW --- */}
        <section className="mt-24 border-t border-gray-100 pt-16">
          <div className="flex items-center gap-4 mb-14">
            <h2 className="text-2xl tracking-[-0.05em] text-gray-900 uppercase">
              <span className="font-bold">DEEP</span> <span className="font-extralight text-gray-400">FLOW</span>
            </h2>
            <div className="h-[px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.4em] uppercase">{temaDeepFlow.titoloSottile}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            <div className="col-span-2 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
              <span className={`text-[9px] font-bold tracking-[0.3em] uppercase mb-8 block ${temaDeepFlow.coloreTema}`}>
                Essenza del Flusso
              </span>
              <h3 className="text-3xl font-light tracking-[-0.03em] text-gray-900 mb-6 leading-snug" dangerouslySetInnerHTML={{ __html: temaDeepFlow.testoTitolo }}></h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-2xl">
                {temaDeepFlow.testoDescrizione}
              </p>
              <div className="w-full h-[1px] bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-3/4 bg-black transition-all duration-[2s]"></div>
              </div>
            </div>

            <div className="bg-black p-10 rounded-2xl text-white flex flex-col justify-between">
              <div>
                <h4 className="text-[9px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-8">Data Points</h4>
                <p className="text-2xl font-extralight tracking-tight leading-snug">Interesse per le arti visive in aumento del 18%.</p>
              </div>
              <button className={`text-[9px] font-bold tracking-[0.4em] uppercase border-b border-white/20 pb-2 self-start transition-all mt-10 ${temaDeepFlow.coloreTema ? `hover:border-pink-500` : `hover:border-white`}`}>
                Esplora {temaDeepFlow.titoloSottile}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;