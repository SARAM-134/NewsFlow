import React, { useRef, useState, useEffect } from 'react';
import api, { getNotizie, getCategories, searchSemantic } from '../services/api';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';

function HomePage() {
  const scrollRef = useRef(null);
  const [notizie, setNotizie] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategorie(response.data.results || response.data);
      } catch (error) {
        console.error("Errore caricamento categorie:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchNews = async (query = '') => {
    setLoading(true);
    try {
      let data;
      if (query) {
        setIsSearching(true);
        const res = await searchSemantic(query);
        data = res.data.results;
      } else {
        setIsSearching(false);
        const params = selectedCategory ? { categoria: selectedCategory } : {};
        const res = await getNotizie(params);
        data = res.results || res.data || res;
      }
      
      const articles = Array.isArray(data) ? data : data.results || [];
      const mappedArticles = articles.map(n => ({
        id: n.id,
        categoria: n.categoria_dettaglio?.nome || "NEWS",
        themeColor: n.categoria_dettaglio?.colore || "#000000",
        titolo: n.titolo,
        riassunto: n.extract_ai || (n.contenuto_originale || "").substring(0, 100) + '...',
        immagine: n.immagine_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500",
        sentiment: n.sentiment_ai || "neutrale",
        textColor: n.sentiment_ai === "positivo" ? "text-green-500" : n.sentiment_ai === "negativo" ? "text-red-500" : "text-gray-500",
        url: n.url_originale || n.url
      }));
      setNotizie(mappedArticles);
    } catch (err) {
      console.error("Errore nel caricamento notizie", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) fetchNews();
  }, [selectedCategory, searchQuery === '']);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) fetchNews(searchQuery);
  };

  const scroll = (direction) => {
    if (direction === 'left') scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    else scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* Barra di Ricerca Premium */}
        <div className="flex flex-col items-center justify-center py-20 w-full max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-light mb-12 tracking-tight leading-tight">
            Scopri le <span className="font-bold italic">Notizie Globali</span> con l'IA
          </h1>
          <form onSubmit={handleSearch} className="relative w-full px-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca concettualmente (es. 'innovazione green')..." 
              className="w-full py-6 px-8 rounded-full border border-gray-100 shadow-2xl focus:outline-none text-lg font-light transition-all focus:ring-4 focus:ring-black/5"
            />
            <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2l1.6 5.4 5.4 1.6-5.4 1.6-1.6 5.4-1.6-5.4-5.4-1.6 5.4-1.6zM19 14l1 3.4 3.4 1-3.4 1-1 3.4-1-3.4-3.4-1 3.4-1zM5 14l.8 2.6 2.6.8-2.6.8-.8 2.6-.8-2.6-2.6-.8 2.6-.8z" />
              </svg>
            </button>
          </form>
          {isSearching && (
            <button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
              Annulla Ricerca
            </button>
          )}
        </div>

        {/* --- FILTRI CATEGORIE --- */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
              !selectedCategory ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
          >
            Tutte
          </button>
          {categorie.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
                selectedCategory === cat.id ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>

        {/* --- SEZIONE 1: DAILY BREAKING --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl tracking-[-0.04em] text-gray-900 uppercase">
              <span className="font-light">{isSearching ? 'RISULTATI' : 'DAILY'}</span> <span className="font-bold">{isSearching ? 'RICERCA AI' : 'BREAKING'}</span>
            </h2>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <div className="relative group">
            <button onClick={() => scroll('left')} className="absolute left-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">←</button>
            <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 px-2 scroll-smooth">
              {loading ? (
                <div className="flex gap-8">
                  {[1,2,3].map(i => <div key={i} className="min-w-[350px] h-[450px] bg-gray-50 animate-pulse rounded-2xl" />)}
                </div>
              ) : notizie.length > 0 ? (
                notizie.map((n) => <NewsCard key={n.id} {...n} />)
              ) : (
                <div className="text-gray-400 font-light italic text-lg py-10 w-full text-center">Nessuna notizia trovata.</div>
              )}
            </div>
            <button onClick={() => scroll('right')} className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">→</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;