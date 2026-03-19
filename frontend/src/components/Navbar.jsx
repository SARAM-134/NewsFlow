<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';

function Navbar() {
  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> dbf9fb2 (Prima pagina completata)
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
        
        {/* TASTO ACCEDI */}
<<<<<<< HEAD
        <button className="bg-black text-white px-7 py-2.5 rounded-full text-[9px] uppercase tracking-[0.25em] font-semibold hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95">
          Accedi
=======
function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">
        NewsFlow 🚀
      </div>
      <div className="space-x-6 text-gray-600 font-medium">
        <a href="#" className="hover:text-blue-500">Home</a>
        <a href="#" className="hover:text-blue-500">Notizie</a>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
          Entra
>>>>>>> 4e5926e (Mary: Navbar colorata e funzionante con Tailwind)
        </button>
=======
        <div className="border-l border-gray-100 h-6 flex items-center pl-10">
          <button className="text-[10px] uppercase tracking-[0.4em] font-bold text-black hover:opacity-30 transition-opacity">
            Accedi
          </button>
        </div>
>>>>>>> dbf9fb2 (Prima pagina completata)
      </div>
=======
import React from 'react';

function Navbar() {
  return (
    <nav className="bg-white p-4 shadow-md flex items-center justify-between sticky top-0 z-50">
  
      <h1 className="text-2xl font-bold text-blue-600">NewsFlow</h1>
      
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
        Accedi
      </button>
>>>>>>> cb18165 (Mary: Sito in progress)
    </nav>
  );
}

export default Navbar;