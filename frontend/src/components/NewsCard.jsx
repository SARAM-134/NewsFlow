import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveNews, deleteSavedNews } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NewsCard = ({ id, url_hash, categoria, themeColor = "#000", titolo, riassunto, immagine, sentiment, textColor, url, initialIsSaved = false, onSaveToggle }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("Accedi per salvare le notizie.");
    
    setLoading(true);
    try {
      if (isSaved) {
        // Nota: Qui servirebbe l'ID dell'interazione per cancellare selettivamente, 
        // ma per ora usiamo l'ID della notizia se l'API lo supporta o delegliamo al backend.
        await deleteSavedNews(id);
      } else {
        await saveNews(id);
      }
      setIsSaved(!isSaved);
      if (onSaveToggle) onSaveToggle(id, !isSaved);
    } catch (err) {
      console.error("Errore salvataggio:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group min-w-[320px] max-w-[320px] bg-white rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-4 border border-gray-100 flex flex-col h-full">
      
      {/* Immagine con Overlay Gradiente */}
      <div className="relative h-56 overflow-hidden">
        <Link to={`/news/${url_hash}`}>
          <img 
            src={immagine} 
            alt={titolo} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-6 left-6">
          <span 
            className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md"
            style={{ backgroundColor: themeColor }}
          >
            {categoria}
          </span>
        </div>
        
        {/* Sentiment Badge */}
        <div className="absolute top-6 right-6">
          <div className={`w-3 h-3 rounded-full shadow-lg ${
            sentiment === 'positivo' ? 'bg-emerald-400' : sentiment === 'negativo' ? 'bg-rose-400' : 'bg-amber-400'
          } animate-pulse`}></div>
        </div>

        {/* Action Button: SALVA */}
        {user && (
          <button 
            onClick={handleSave}
            disabled={loading}
            className="absolute bottom-6 right-6 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-black hover:text-white transform translate-y-4 group-hover:translate-y-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className={isSaved ? 'text-rose-500 text-lg' : 'text-lg'}>{isSaved ? '♥' : '♡'}</span>
            )}
          </button>
        )}
      </div>

      {/* Contenuto */}
      <div className="p-8 flex flex-col flex-1">
        <div className="mb-4">
          <span className={`text-[8px] font-bold uppercase tracking-[0.3em] ${textColor || 'text-gray-400'}`}>
            Sentimento {sentiment || 'Neutrale'}
          </span>
        </div>
        
        <Link to={`/news/${url_hash}`} className="block group/title">
          <h3 className="text-xl font-serif font-medium leading-tight text-gray-900 line-clamp-2 mb-4 group-hover/title:text-gray-600 transition-colors italic-hover">
            {titolo}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-3 mb-8 italic">
          "{riassunto}"
        </p>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
          <Link to={`/news/${url_hash}`} className="text-[10px] font-bold uppercase tracking-widest text-black flex items-center gap-2 group/more">
            Dettagli <span className="transition-transform group-hover/more:translate-x-1">→</span>
          </Link>
          
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-gray-200 hover:text-black transition-colors">
            Fonte ↗
          </a>
        </div>
      </div>
      
      {/* Flow line */}
      <div className="h-1 w-0 group-hover:w-full transition-all duration-1000 ease-in-out" style={{ backgroundColor: themeColor }} />
    </div>
  );
};

export default NewsCard;