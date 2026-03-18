function NewsCard() {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:scale-105 transition-transform duration-300">
      {/* Immagine della notizia */}
      <img 
        className="w-full h-48 object-cover" 
        src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=500" 
        alt="News" 
      />
      
      {/* Testo della figurina */}
      <div className="p-5">
        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full uppercase">
          Tecnologia
        </span>
        <h3 className="mt-3 text-xl font-bold text-gray-900">
          L'intelligenza artificiale impara a cucinare! 🤖🍕
        </h3>
        <p className="mt-2 text-gray-500 text-sm leading-relaxed">
          Oggi i robot hanno preparato la loro prima pizza. Il risultato? Croccante e digitale!
        </p>
        
        <button className="mt-4 w-full bg-gray-50 text-blue-600 font-semibold py-2 rounded-xl hover:bg-blue-50 transition">
          Leggi di più
        </button>
      </div>
    </div>
  );
}

export default NewsCard;