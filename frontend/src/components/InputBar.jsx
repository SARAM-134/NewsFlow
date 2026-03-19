import React from 'react';

function InputBar() {
  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <div className="flex w-full max-w-2xl bg-white rounded-full shadow-lg border border-gray-100 p-2 items-center">
       <span className="text-gray-400 text-xl px-3">🔗</span>
        
        <input 
          type="text" 
          placeholder="Incolla qui il link di una notizia..." 
          className="flex-grow p-3 text-gray-700 outline-none placeholder-gray-400 bg-transparent text-lg"
        />
        
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
          Riassumi
        </button>
      </div>

      <p className="text-gray-500 text-base font-medium">
        Il servizio NewsFlow è pronto ad aiutarti.
      </p>
    </div>
  );
}

export default InputBar;