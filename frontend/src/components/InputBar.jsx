import React from 'react';

function InputBar() {
  return (
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
      </div>
    </div>
  );
}

export default InputBar;