import React from 'react';

const InputBar = () => {
  return (
<<<<<<< HEAD
    <div className="flex flex-col items-center justify-center py-20 w-full max-w-4xl mx-auto">
      {/* Titolo */}
      <h1 className="text-6xl font-light mb-12 text-center tracking-tight">
        Scopri le <span className="font-bold italic">Notizie Globali</span>
      </h1>

      {/* Barra di Input */}
      <div className="relative w-full px-4">
        <input 
          type="text" 
          placeholder="Incolla qui il link della notizia..." 
          className="w-full py-6 px-8 rounded-full border border-gray-100 shadow-xl focus:outline-none text-lg font-light placeholder-gray-300"
        />
        
        {/* Bottone con Sparkle Elegante */}
        <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg">
          <svg 
            className="w-6 h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2l1.6 5.4 5.4 1.6-5.4 1.6-1.6 5.4-1.6-5.4-5.4-1.6 5.4-1.6zM19 14l1 3.4 3.4 1-3.4 1-1 3.4-1-3.4-3.4-1 3.4-1zM5 14l.8 2.6 2.6.8-2.6.8-.8 2.6-.8-2.6-2.6-.8 2.6-.8z" />
          </svg>
        </button>
=======
    <div className="w-full max-w-4xl mx-auto mt-20 text-center px-4">
      {/* Titolo con "Notizie Globali" in Bold */}
      <h1 className="text-5xl font-light text-black mb-6 tracking-tight">
        Scopri le <span className="font-bold italic serif">Notizie Globali</span>
      </h1>


      {/* Barra di ricerca con allineata */}
      <div className="relative max-w-2xl mx-auto flex items-center justify-center">
        <input 
          type="text" 
          placeholder="Incolla qui il link della notizia..."
          className="w-full bg-white border border-gray-100 py-5 px-8 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.02)] focus:outline-none focus:border-gray-200 transition-all text-sm font-light text-gray-400 placeholder:text-gray-200"
        />
        {/* Il bottone centrato*/}
        <div className="absolute right-2 top-0 bottom-0 flex items-center">
          <button className="bg-black text-white px-8 h-[calc(100%-16px)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center">
            Riassumi
          </button>
        </div>
>>>>>>> dbf9fb2 (Prima pagina completata)
      </div>
    </div>
  );
};

export default InputBar;