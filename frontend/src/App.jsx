import Navbar from './components/Navbar';
import InputBar from './components/InputBar';
import NewsCard from './components/NewsCard';

const notizieDalDatabase = [
  {
    id: 1,
    titolo: "L'intelligenza artificiale impara a cucinare!",
    estratto_ai: "Un nuovo modello di AI ha imparato a preparare la pizza perfetta analizzando migliaia di ricette.",
    categoria: "Tech",
    sentiment: "positivo",
    immagine: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
  },
  {
    id: 2,
    titolo: "Nuovi parchi verdi in città",
    estratto_ai: "Il comune ha approvato il piano per 10 nuovi spazi verdi entro la fine dell'anno.",
    categoria: "Ambiente",
    sentiment: "positivo",
    immagine: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500"
  },
  {
    id: 3,
    titolo: "Sconfitta amara per la squadra locale",
    estratto_ai: "Una partita difficile che si conclude con un 2-0. La difesa ha faticato molto.",
    categoria: "Sport",
    sentiment: "negativo",
    immagine: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-8">
        <InputBar />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {notizieDalDatabase.map((notizia) => (
            <NewsCard
              key={notizia.id}
              titolo={notizia.titolo}
              riassunto={notizia.estratto_ai}
              categoria={notizia.categoria}
              immagine={notizia.immagine}
              sentiment={notizia.sentiment}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;