import React, { useState } from 'react';

function NewsCard({ categoria, titolo, riassunto, immagine, textColor }) {
  // Stato per gestire se la notizia è salvata o no (inizialmente false)
  const [isSaved, setIsSaved] = useState(false);

  // Funzione per gestire il click sul cuore
  const toggleSave = () => {
    setIsSaved(!isSaved); // Inverte lo stato (true <-> false)
    // Qui in futuro puoi aggiungere la logica per salvare davvero la notizia (es: inviare a un database o localStorage)
    console.log(`Notizia "${titolo}" ${!isSaved ? 'salvata' : 'rimossa dai salvati'}`);
  };

  return (
    <div className="min-w-[350px] bg-white rounded-2xl border border-gray-100 p-6 flex flex-col group hover:border-gray-200 transition-all duration-300 relative overflow-hidden">
      {/* Categoria: Diventa rosa se textColor esiste, altrimenti resta grigia */}
      <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 block ${textColor || 'text-gray-400'}`}>
        {categoria}
      </span>
      
      {/* Contenitore Immagine (position: relative per il cuore absolute) */}
      <div className="overflow-hidden rounded-xl mb-6 h-48 relative">
        <img 
          src={immagine} 
          alt={titolo} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* --- CUORE PER SALVARE (Minimal in basso a destra dell'immagine) --- */}
        <button 
          onClick={toggleSave} // Gestisce il click
          className="absolute bottom-3 right-3 p-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-gray-100 hover:bg-white transition-all shadow-sm"
          title={isSaved ? "Rimuovi dai salvati" : "Salva notizia"}
        >
          {/* Icona Cuore SVG Dinamica (rosa/piena se salvata, grigia/vuota se non salvata) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill={isSaved ? "#EC4899" : "none"} // Pieno: Colore Rosa (#EC4899 è pink-500) o Vuoto
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke={isSaved ? "#EC4899" : "#9CA3AF"} // Bordo: Rosa o Grigio (gray-400)
            className={`w-4 h-4 transition-colors duration-300`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight leading-snug line-clamp-2">
        {titolo}
      </h3>
      
      <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-2">
        {riassunto}
      </p>
    </div>
  );
}

export default NewsCard;