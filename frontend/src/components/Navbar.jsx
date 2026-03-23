import React from 'react';

function Navbar() {
  return (
    <nav className="bg-white px-10 py-6 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100/50">
      
      {/* LOGO NEWSFLOW AGGIORNATO */}
      <div className="flex items-center gap-4 cursor-pointer group">
        {/* Monogramma N + f (Senza punto) */}
        <div className="relative flex items-center justify-center w-12 h-12">
          {/* La N Bold Serif - Stile Editoriale */}
          <span className="text-4xl font-serif font-bold text-black leading-none translate-x-[-4px]">
            N
          </span>
          {/* La f Calligrafica - Rappresenta il 'Flow' */}
          <span className="absolute text-5xl font-light italic text-black/80 font-serif leading-none translate-x-[8px] translate-y-[-2px] opacity-90 group-hover:scale-105 transition-transform duration-500 ease-in-out" 
                style={{ fontFamily: 'serif', fontStyle: 'italic' }}>
            f
          </span>
        </div>

        {/* Testo Brand: NewsFlow */}
        <div className="flex flex-col leading-tight border-l border-gray-200 pl-4">
          <h1 className="text-lg font-medium tracking-[0.25em] uppercase text-black">
            News<span className="font-light">Flow</span>
          </h1>
          <span className="text-[8px] tracking-[0.45em] text-gray-400 uppercase font-light mt-0.5">
            News Intelligence
          </span>
        </div>
      </div>
      
      {/* SEZIONE DESTRA (AZIONI) */}
      <div className="flex items-center gap-8">
        {/* ICONA SALVATI */}
        <button className="text-gray-400 hover:text-black transition-colors p-1" title="Salvati">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
        
        {/* TASTO ACCEDI */}
        <button className="bg-black text-white px-7 py-2.5 rounded-full text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95">
          Accedi
        </button>
      </div>
    </nav>
  );
}

export default Navbar;