import React from 'react';

const InputBar = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 w-full max-w-4xl mx-auto">
      {/* Titolo più grande */}
      <h1 className="text-6xl font-light mb-12 text-center tracking-tight">
        Scopri le <span className="font-bold italic">Notizie Globali</span>
      </h1>

      {/* Barra di Input con Stella */}
      <div className="relative w-full px-4">
        <input 
          type="text" 
          placeholder="Incolla qui il link della notizia..." 
          className="w-full py-6 px-8 rounded-full border border-gray-100 shadow-xl focus:outline-none text-lg"
        />
        
        {/* Bottone con Stella e scritta Codice */}
        <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white rounded-full h-[70%] px-6 flex flex-col items-center justify-center hover:scale-105 transition-transform">
          <span className="text-xl">★</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Codice</span>
        </button>
      </div>

      {/* Bottone ENTRA (Sostituisce Entra nel flusso) */}
      <button className="mt-10 bg-black text-white px-16 py-4 rounded-full font-bold text-lg tracking-[0.2em] shadow-2xl hover:bg-gray-900 transition-all active:scale-95">
        ENTRA
      </button>
    </div>
  );
};

export default InputBar;