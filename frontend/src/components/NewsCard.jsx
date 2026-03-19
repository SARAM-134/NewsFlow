function NewsCard({ titolo, riassunto, categoria, immagine, sentiment }) {
  // 1. Definiamo il colore del bordo in base al sentimento (come PDF)
  const bordoColore = sentiment === "positivo" 
    ? "border-green-500" 
    : sentiment === "negativo" 
    ? "border-red-500" 
    : "border-gray-200";

  return (
    <div className={`max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${bordoColore} hover:scale-105 transition-transform duration-300`}>
      {/* Immagine della notizia  */}
      <img
        className="w-full h-48 object-cover"
        src={immagine}
        alt={titolo}
      />

      <div className="p-5">
        {/* Categoria */}
        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full uppercase">
          {categoria}
        </span>

        {/* Titolo  */}
        <h3 className="mt-3 text-xl font-bold text-gray-900">
          {titolo}
        </h3>

        {/* Riassunto AI  */}
        <p className="mt-2 text-gray-500 text-sm leading-relaxed">
          {riassunto}
        </p>

        <button className="mt-4 w-full bg-gray-50 text-blue-600 font-semibold py-2 rounded-xl hover:bg-blue-50 transition">
          Leggi di più
        </button>
      </div>
    </div>
  );
}

export default NewsCard;

