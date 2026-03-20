import React from 'react';

function NewsCard({ categoria, titolo, riassunto, immagine, sentiment, onDettagliClick }) {
  
  const categoryColors = {
    "DESIGN": "text-yellow-400",       // GIALLO
    "CUCINA": "text-[#800020]",        // BORDEAUX
    "NATURA": "text-green-400",        // VERDE CHIARO
    "ECONOMIA": "text-emerald-900",    // VERDE SCURO
    "AMBIENTE": "text-[#8B4513]",      // MARRONCINO 
    "TECNOLOGIA": "text-cyan-500",     // AZZURRO TECH
    "DAL MONDO": "text-orange-500",    // ARANCIONE
    "default": "text-gray-500"
  };

  // 2. Stili per il PALLINO PULSANTE (Sempre attivo)
  const sentimentStyles = {
    positivo: { dot: "bg-green-600", pulse: "bg-green-400" },
    negativo: { dot: "bg-red-600", pulse: "bg-red-400" },
    neutro: { dot: "bg-gray-400", pulse: "bg-gray-300" },
    default: { dot: "bg-gray-400", pulse: "bg-gray-300" }
  };

  const currentCatColor = categoryColors[categoria?.toUpperCase()] || categoryColors.default;
  const currentSent = sentimentStyles[sentiment] || sentimentStyles.default;

  return (
    <div className="min-w-[400px] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Immagine con Zoom al passaggio del mouse */}
      <div className="h-64 overflow-hidden">
        <img 
          src={immagine} 
          alt={titolo} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
        />
      </div>

      <div className="p-8 flex-1 flex flex-col">
        {/* Categoria con Colore Dinamico */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${currentCatColor}`}>
            {categoria}
          </span>
          <span className="text-[10px] text-gray-300 font-medium uppercase">IT</span>
        </div>

        <h3 className="text-2xl font-light text-gray-900 mb-4 leading-tight">
          {titolo}
        </h3>

        <p className="text-gray-400 text-sm font-light leading-relaxed italic mb-8 flex-1">
          "{riassunto}"
        </p>

        {/* Footer: Pallino Pulsante e Bottone Dettagli */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-50 mt-4">
          <div className="relative flex h-3 w-3">
            <span className={`animate-pulse absolute inline-flex h-full w-full rounded-full ${currentSent.pulse} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${currentSent.dot} border-2 border-white shadow-sm`}></span>
          </div>
          
          <button
            onClick={onDettagliClick}
            className="text-xs font-semibold uppercase tracking-[0.2em] font-bold text-gray-900 pb-1 border-b-2 border-gray-900 hover:border-black transition-all"
          >
            DETTAGLI
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;