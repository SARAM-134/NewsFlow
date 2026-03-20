import React from 'react';

const InputBar = () => {
  return (
<<<<<<< HEAD
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
=======
    <div className="flex flex-col items-center justify-center py-20 w-full max-w-4xl mx-auto">
      {/* Titolo più grande */}
      <h1 className="text-6xl font-light mb-12 text-center tracking-tight">
        Scopri le <span className="font-bold italic">Notizie Globali</span>
>>>>>>> d4112a9 (modifiche)
      </h1>

      {/* Barra di Input con Stella */}
      <div className="relative w-full px-4">
        <input 
          type="text" 
          placeholder="Incolla qui il link della notizia..." 
          className="w-full py-6 px-8 rounded-full border border-gray-100 shadow-xl focus:outline-none text-lg"
        />
<<<<<<< HEAD
        {/* Il bottone centrato*/}
        <div className="absolute right-2 top-0 bottom-0 flex items-center">
          <button className="bg-black text-white px-8 h-[calc(100%-16px)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center">
            Riassumi
          </button>
        </div>
>>>>>>> dbf9fb2 (Prima pagina completata)
=======
        
        {/* Bottone con Stella e scritta Codice */}
        <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white rounded-full h-[70%] px-6 flex flex-col items-center justify-center hover:scale-105 transition-transform">
          <span className="text-xl">★</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Codice</span>
        </button>
>>>>>>> d4112a9 (modifiche)
      </div>

      {/* Bottone ENTRA (Sostituisce Entra nel flusso) */}
      <button className="mt-10 bg-black text-white px-16 py-4 rounded-full font-bold text-lg tracking-[0.2em] shadow-2xl hover:bg-gray-900 transition-all active:scale-95">
        ENTRA
      </button>
    </div>
  );
};

export default InputBar;