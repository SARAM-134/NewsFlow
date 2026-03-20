import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import InputBar from './components/InputBar';
import NewsCard from './components/NewsCard';

function App() {
  const scrollRef = useRef(null);

  const notizie = [
    { 
      id: 1, 
      categoria: "DAL MONDO", 
      titolo: "Luci e colori dal Festival d'Oriente", 
      riassunto: "Un'esplosione di tradizioni che unisce i popoli in un abbraccio universale.", 
      immagine: "https://images.pexels.com/photos/36560064/pexels-photo-36560064.jpeg", 
      sentiment: "positivo" 
    },
    { 
      id: 2, 
      categoria: "DESIGN", 
      titolo: "L'estetica del silenzio moderno", 
      riassunto: "Come il minimalismo trasforma le nostre case in oasi di luce e pace.", 
      immagine: "https://images.pexels.com/photos/6445/sign-pencil-black-pencils.jpg", 
      sentiment: "positivo" 
    },
    { 
      id: 3, 
      categoria: "CUCINA", 
      titolo: "I segreti del Sushi millenario", 
      riassunto: "L'arte dei maestri giapponesi arriva finalmente nelle nostre cucine.", 
      immagine: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg", 
      sentiment: "positivo" 
    },
    { 
      id: 4, 
      categoria: "NATURA", 
      titolo: "Il ritorno delle balene azzurre", 
      riassunto: "Uno spettacolo incredibile avvistato al largo delle coste australiane.", 
      immagine: "https://images.pexels.com/photos/4781938/pexels-photo-4781938.jpeg", 
      sentiment: "positivo" 
    } ,
    { 
      id: 5, 
      categoria: "ECONOMIA", 
      titolo: "Crisi dei mercati: crollo improvviso", 
      riassunto: "Le borse europee chiudono in forte calo dopo le ultime decisioni sui tassi.", 
      immagine: "https://images.pexels.com/photos/5833762/pexels-photo-5833762.jpeg", 
      sentiment: "negativo" 
    },
    { 
      id: 6, 
      categoria: "AMBIENTE", 
      titolo: "Emergenza siccità nei grandi fiumi", 
      riassunto: "I livelli dell'acqua sono ai minimi storici, agricoltura a rischio in tutta Italia.", 
      immagine: "https://images.pexels.com/photos/7639331/pexels-photo-7639331.jpeg", 
      sentiment: "negativo" 
    },
    { 
  id: 7, 
  categoria: "TECNOLOGIA", 
  titolo: "Nuovo aggiornamento per i sistemi satellitari", 
  riassunto: "Rilasciata la versione 4.0 del protocollo di comunicazione globale per il monitoraggio meteo.", 
  immagine: "https://images.pexels.com/photos/3892612/pexels-photo-3892612.jpeg", 
  sentiment: "neutro" 
}
    
  ];

  const scroll = (direction) => {
    if (direction === 'left') scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    else scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <InputBar />
        <div className="relative mt-12 group">
          <button onClick={() => scroll('left')} className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-lg p-3 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">
            ←
          </button>
          <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 px-2 scroll-smooth">
            {notizie.map((n) => <NewsCard key={n.id} {...n} />)}
          </div>
          <button onClick={() => scroll('right')} className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-lg p-3 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">
            →
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;