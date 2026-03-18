function InputBar() {
  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="relative flex items-center">
        <input 
          type="text" 
          placeholder="Incolla qui il link di una notizia... 🔗" 
          className="w-full p-5 pr-40 rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:outline-none shadow-inner bg-white text-lg transition-all"
        />
        
        <button className="absolute right-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 hover:scale-110 hover:rotate-2 transition-all duration-300 shadow-md active:scale-95">
          Riassumi ✨
        </button>
      </div>
      <p className="text-center text-gray-400 text-sm mt-3 font-medium">
        Il robottino NewsFlow è pronto ad aiutarti! 🤖
      </p>
    </div>
  );
}

export default InputBar;