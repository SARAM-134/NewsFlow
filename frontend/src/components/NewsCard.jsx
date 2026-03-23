import React, { useState } from 'react';

function NewsCard({ categoria, titolo, riassunto, immagine, themeColor = "#000000", readTime = "5" }) {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <div className="group relative min-w-[360px] bg-white flex flex-col cursor-pointer transition-all duration-700 ease-out border-b border-gray-100 pb-8 hover:border-black/10">

      {/* 1. IMMAGINE */}
      <div className="relative aspect-[16/9] overflow-hidden mb-6 bg-gray-50">
        <img
          src={immagine}
          alt={titolo}
          className="w-full h-full object-cover opacity-90 grayscale-[0.4] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-in-out"
        />

        {/* Gradient overlay per "pulire" l'immagine */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Pulsante Salva - Floating & Glassmorphism */}
        <button
          onClick={toggleSave}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isSaved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.2}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'scale-110' : 'text-white'}`}
            style={isSaved ? { color: themeColor } : {}}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* 2. AREA TESTUALE: Tipografia Editoriale */}
      <div className="flex flex-col flex-grow px-1">

        {/* Categoria: Tracking ampio per eleganza */}
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: themeColor }}>
          {categoria}
        </span>

        {/* Titolo: Serif font (se importato) o un font di sistema elegante */}
        <h3 className="text-2xl font-serif font-medium text-black leading-[1.2] mb-4 group-hover:text-gray-700 transition-colors line-clamp-2 italic-hover">
          {titolo}
        </h3>

        {/* Riassunto: Colore alleggerito e font light */}
        <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2 mb-8">
          {riassunto}
        </p>

        {/* 3. FOOTER: Metadati puliti */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-gray-300 uppercase tracking-widest font-medium">AI Flow</span>
            <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
          </div>

          {/* Minuti di lettura in basso a destra */}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-light tracking-wide uppercase">
            <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{readTime} min lettura</span>
          </div>
        </div>
      </div>

      {/* Linea di progresso estetica (Flow) sul fondo al passaggio del mouse */}
      <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-1000 ease-in-out" style={{ backgroundColor: themeColor }} />
    </div>
  );
}

export default NewsCard;