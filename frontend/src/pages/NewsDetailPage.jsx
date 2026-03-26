import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const NewsDetailPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`notizie/${hash}/`);
        setNews(res.data);
      } catch (err) {
        console.error("Errore caricamento dettaglio notizia:", err);
        setError('Impossibile caricare i dettagli della notizia.');
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-8 animate-pulse">
          <div className="h-10 bg-gray-100 rounded-lg w-3/4"></div>
          <div className="h-64 bg-gray-50 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-50 rounded w-full"></div>
            <div className="h-4 bg-gray-50 rounded w-full"></div>
            <div className="h-4 bg-gray-50 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-400 mb-8">{error || 'Notizia non trovata.'}</p>
          <button onClick={() => navigate('/')} className="text-xs font-bold uppercase tracking-widest border-b border-black">Torna alla Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900 pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-16">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors flex items-center gap-2"
        >
          <span>←</span> Indietro
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white shadow-sm" style={{ backgroundColor: news.categoria_dettaglio?.colore || '#000' }}>
              {news.categoria_dettaglio?.nome || 'News'}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {new Date(news.data_pubblicazione).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-5xl font-serif font-bold tracking-tight leading-tight text-gray-900 mb-8">
            {news.titolo}
          </h1>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
               {news.fonte_dettaglio?.nome?.charAt(0) || 'F'}
             </div>
             <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
               Fonte: <span className="text-black italic">{news.fonte_dettaglio?.nome || 'Aggregatore'}</span>
             </p>
          </div>
        </header>

        {news.immagine_url && (
          <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img 
              src={news.immagine_url} 
              alt={news.titolo} 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <article className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed space-y-6">
              {news.contenuto_originale ? (
                news.contenuto_originale.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p className="italic text-gray-400">Contenuto non disponibile.</p>
              )}
            </article>

            <div className="mt-16 pt-12 border-t border-gray-50">
              <a 
                href={news.url_originale} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-black text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Leggi su Fonte Originale
              </a>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            {/* Box AI */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-purple-600">Analisi AI</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[9px] font-bold uppercase text-gray-400 tracking-widest mb-2">Sentiment</h4>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                    news.sentiment_ai === 'positivo' ? 'bg-emerald-50 text-emerald-600' : 
                    news.sentiment_ai === 'negativo' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {news.sentiment_ai || 'Neutrale'}
                  </span>
                </div>

                <div>
                  <h4 className="text-[9px] font-bold uppercase text-gray-400 tracking-widest mb-2">Riassunto Intelligente</h4>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{news.extract_ai || "Analisi in corso..."}"
                  </p>
                </div>

                <div>
                  <h4 className="text-[9px] font-bold uppercase text-gray-400 tracking-widest mb-3">Tag Correlati</h4>
                  <div className="flex flex-wrap gap-2">
                    {news.tags_dettaglio && news.tags_dettaglio.length > 0 ? (
                      news.tags_dettaglio.map(tag => (
                        <span key={tag.id} className="text-[9px] font-medium bg-white border border-gray-100 px-3 py-1 rounded-md text-gray-400">
                          #{tag.nome}
                        </span>
                      ))
                    ) : (
                      <span className="text-[9px] text-gray-300 italic">Nessun tag</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Provider Info */}
            <div className="px-8 flex flex-col items-center">
               <p className="text-[8px] uppercase tracking-widest text-gray-300 font-bold">Processed by {news.provider_ai || 'Local Engine'}</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default NewsDetailPage;
