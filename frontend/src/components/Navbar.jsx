import React from 'react';

function Navbar() {
  return (
    <nav className="bg-white px-10 py-8 flex items-center justify-between sticky top-0 z-50 border-b border-gray-50/50">
      
      {/* LOGO E PAYOFF */}
      <div className="flex flex-col cursor-pointer group leading-none">
        <div className="flex items-baseline gap-1.5 text-black">
          <h1 className="text-xl font-extralight tracking-[0.35em] uppercase">
            News<span className="font-semibold">Flow</span>
          </h1>
          <span className="w-1.5 h-1.5 bg-black rounded-full mb-1"></span>
        </div>
        <span className="text-[9px] tracking-[0.5em] text-gray-300 uppercase font-light mt-2.5">
          News Intelligence
        </span>
      </div>
      
      {/* SEZIONE DESTRA ALLINEATA */}
      <div className="flex items-center gap-10">
        
        {/* CUORE SALVATI */}
        <button className="text-gray-300 hover:text-black transition-colors flex items-center justify-center" title="Salvati">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
        
        {/* TASTO ACCEDI */}
        <div className="border-l border-gray-100 h-6 flex items-center pl-10">
          <button className="text-[10px] uppercase tracking-[0.4em] font-bold text-black hover:opacity-30 transition-opacity">
            Accedi
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;