import React from 'react';

const InputBar = () => {
  return (
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
      </div>

      {/* Il bottone ENTRA è stato rimosso come richiesto */}
    </div>
  );
};

export default InputBar;