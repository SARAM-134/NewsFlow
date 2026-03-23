<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b1813d6 (Mary: Navbar colorata e funzionante con Tailwind)
=======
>>>>>>> 562c129 (Mary: Sito in progress)
=======
>>>>>>> fe9f415 (Prima pagina completata)
=======
>>>>>>> 3632389 (modifiche)
=======
>>>>>>> 0ff4481 (Mary: Inizializzato frontend e creata Navbar)
=======
>>>>>>> c9cec4b (Mary: Inizializzato frontend e creata Navbar)
=======
>>>>>>> 93957fd (Prima pagina completata)
=======
>>>>>>> a36d81f (modifiche)
import React, { useRef, useState } from 'react';

=======
import React, { useRef } from 'react';
>>>>>>> dbf9fb2 (Prima pagina completata)
=======
import React, { useRef, useState } from 'react';
>>>>>>> d4112a9 (modifiche)
import Navbar from './components/Navbar';

import InputBar from './components/InputBar';

import NewsCard from './components/NewsCard';
=======
import Navbar from "./components/Navbar";
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 4e5926e (Mary: Navbar colorata e funzionante con Tailwind)
=======
import NewsCard from "./components/NewsCard"; // Prendi la figurina dalla scatola!
>>>>>>> 3e11775 (Mary: Aggiunta la prima NewsCard per le notizie)
=======
import InputBar from "./components/InputBar"; // Prendi la scatola!
import NewsCard from "./components/NewsCard";
>>>>>>> 7cf029d (Mary: Aggiunta inputbar)
=======
=======
import React, { useRef } from 'react';
>>>>>>> fdbac5e (Prima pagina completata)
=======
import React, { useRef, useState } from 'react';
>>>>>>> b20b985 (modifiche)
=======
>>>>>>> 7301184 (Mary: Inizializzato frontend e creata Navbar)
=======
import React, { useRef } from 'react';
>>>>>>> 9dd4e9f (Prima pagina completata)
=======
import React, { useRef, useState } from 'react';
>>>>>>> 4853613 (modifiche)
import Navbar from './components/Navbar';
import InputBar from './components/InputBar';
import NewsCard from './components/NewsCard';

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7301184 (Mary: Inizializzato frontend e creata Navbar)
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
<<<<<<< HEAD
    immagine: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500" 
  }
]; 
>>>>>>> cb18165 (Mary: Sito in progress)

<<<<<<< HEAD
<<<<<<< HEAD

=======
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
>>>>>>> c3a54d8 (Mary: Inizializzato frontend e creata Navbar)

function App() {

  const scrollRef = useRef(null);



  // NOTIZIE (con colori e sentiment come prima)

  const notizie = [

    { 

      id: 1, 

      categoria: "DAL MONDO", 

      titolo: "Luci e colori dal Festival d'Oriente", 

      riassunto: "Un'esplosione di tradizioni che unisce i popoli in un abbraccio universale.", 

      immagine: "https://images.pexels.com/photos/36560064/pexels-photo-36560064.jpeg", 

      sentiment: "positivo",

      textColor: "text-blue-500" // Blu

    },

    { 

      id: 2, 

      categoria: "CULTURA", 

      titolo: "Il Rinascimento Digitale a Firenze", 

      riassunto: "Le opere del Botticelli prendono vita grazie alla realtà aumentata e all'IA.", 

      immagine: "https://images.pexels.com/photos/2372977/pexels-photo-2372977.jpeg", 

      sentiment: "positivo",

      textColor: "text-pink-500" // Rosa

    },

    { 

      id: 3, 

      categoria: "DESIGN", 

      titolo: "L'estetica del silenzio moderno", 

      riassunto: "Come il minimalismo trasforma le nostre case in oasi di luce e pace.", 

      immagine: "https://images.pexels.com/photos/6445/sign-pencil-black-pencils.jpg", 

      sentiment: "positivo",

      textColor: "text-gray-900" // Nero

    },

    { 

      id: 4, 

      categoria: "CUCINA", 

      titolo: "I segreti del Sushi millenario", 

      riassunto: "L'arte dei maestri giapponesi arriva finalmente nelle nostre cucine.", 

      immagine: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg", 

      sentiment: "positivo",

      textColor: "text-orange-400" // Arancione

    },

    { 

      id: 5, 

      categoria: "NATURA", 

      titolo: "Il ritorno delle balene azzurre", 

      riassunto: "Uno spettacolo incredibile avvistato al largo delle coste australiane.", 

      immagine: "https://images.pexels.com/photos/4781938/pexels-photo-4781938.jpeg", 

      sentiment: "positivo",

      textColor: "text-green-500" // Verde

    },

    { 

      id: 6, 

      categoria: "ECONOMIA", 

      titolo: "Crisi dei mercati: crollo improvviso", 

      riassunto: "Le borse europee chiudono in forte calo dopo le ultime decisioni sui tassi.", 

      immagine: "https://images.pexels.com/photos/5833762/pexels-photo-5833762.jpeg", 

      sentiment: "negativo",

      textColor: "text-red-500" // Rosso

    }

  ];



  // Configurazione Dinamica per la Sezione DEEP FLOW (Scegli il tema qui)

  const [temaDeepFlow, setTemaDeepFlow] = useState({

    titoloSottile: "CULTURE", // Titolo a destra

    coloreTema: "text-pink-500", // Colore per "Essenza del Flusso" e pulsante (Rosa per Cultura)

    testoTitolo: "La riscoperta delle tradizioni <span class='font-medium text-gray-950'>guida</span> il nuovo rinascimento creativo.",

    testoDescrizione: "L'analisi mostra un forte interesse per le radici storiche: l'85% degli utenti interagisce con contenuti d'arte digitale."

  });



  const scroll = (direction) => {

    if (direction === 'left') scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });

    else scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });

  };



  return (
<<<<<<< HEAD

    <div className="min-h-screen bg-white font-sans antialiased">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pb-24">

=======
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pb-20">
>>>>>>> dbf9fb2 (Prima pagina completata)
        <InputBar />
<<<<<<< HEAD



        {/* --- SEZIONE 1: DAILY BREAKING (TUTTO NERO) --- */}

        <section className="mt-16">

          <div className="flex items-center gap-4 mb-8">

            <h2 className="text-xl tracking-[-0.04em] text-gray-900 uppercase">

              <span className="font-light">DAILY</span> <span className="font-bold">BREAKING</span>

            </h2>

            <div className="h-[1px] flex-1 bg-gray-100"></div>

          </div>



          <div className="relative group">

            <button onClick={() => scroll('left')} className="absolute left-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">←</button>

            <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 px-2 scroll-smooth">

              {notizie.map((n) => <NewsCard key={n.id} {...n} />)}

            </div>

            <button onClick={() => scroll('right')} className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">→</button>

          </div>

        </section>



        {/* --- SEZIONE 2: DEEP FLOW (DINAMICA E COLORATA) --- */}

        <section className="mt-24 border-t border-gray-100 pt-16">

          <div className="flex items-center gap-4 mb-14">

            <h2 className="text-2xl tracking-[-0.05em] text-gray-900 uppercase">

              <span className="font-bold">DEEP</span> <span className="font-extralight text-gray-400">FLOW</span>

            </h2>

            <div className="h-[px] flex-1 bg-gray-100"></div>

            <span className="text-[10px] font-bold text-gray-300 tracking-[0.4em] uppercase">{temaDeepFlow.titoloSottile}</span>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">

            {/* Card Bianca: Il colore dell'etichetta è dinamico */}

            <div className="col-span-2 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">

              <span className={`text-[9px] font-bold tracking-[0.3em] uppercase mb-8 block ${temaDeepFlow.coloreTema}`}>

                Essenza del Flusso

              </span>

              <h3 className="text-3xl font-light tracking-[-0.03em] text-gray-900 mb-6 leading-snug" dangerouslySetInnerHTML={{ __html: temaDeepFlow.testoTitolo }}></h3>

              <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-2xl">

                {temaDeepFlow.testoDescrizione}

              </p>

              <div className="w-full h-[1px] bg-gray-100 relative overflow-hidden">

                <div className="absolute inset-y-0 left-0 w-3/4 bg-black transition-all duration-[2s]"></div>

              </div>

            </div>



            {/* Card Nera: Il colore del pulsante al passaggio del mouse è dinamico */}

            <div className="bg-black p-10 rounded-2xl text-white flex flex-col justify-between">

              <div>

                <h4 className="text-[9px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-8">Data Points</h4>

                <p className="text-2xl font-extralight tracking-tight leading-snug">Interesse per le arti visive in aumento del 18%.</p>

              </div>

              <button className={`text-[9px] font-bold tracking-[0.4em] uppercase border-b border-white/20 pb-2 self-start transition-all mt-10 ${ temaDeepFlow.coloreTema ? `hover:border-pink-500` : `hover:border-white` }`}>

                Esplora {temaDeepFlow.titoloSottile}

              </button>

            </div>

          </div>

        </section>

=======
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
>>>>>>> c3a54d8 (Mary: Inizializzato frontend e creata Navbar)
=======
function App() {
  const scrollRef = useRef(null);

  // NOTIZIE (con colori e sentiment come prima)
  const notizie = [
    {
      id: 1,
      categoria: "DAL MONDO",
      titolo: "Luci e colori dal Festival d'Oriente",
      riassunto: "Un'esplosione di tradizioni che unisce i popoli in un abbraccio universale.",
      immagine: "https://images.pexels.com/photos/36560064/pexels-photo-36560064.jpeg",
      sentiment: "positivo",
      textColor: "text-blue-500" // Blu
    },
    {
      id: 2,
      categoria: "CULTURA",
      titolo: "Il Rinascimento Digitale a Firenze",
      riassunto: "Le opere del Botticelli prendono vita grazie alla realtà aumentata e all'IA.",
      immagine: "https://images.pexels.com/photos/2372977/pexels-photo-2372977.jpeg",
      sentiment: "positivo",
      textColor: "text-pink-500" // Rosa
    },
    {
      id: 3,
      categoria: "DESIGN",
      titolo: "L'estetica del silenzio moderno",
      riassunto: "Come il minimalismo trasforma le nostre case in oasi di luce e pace.",
      immagine: "https://images.pexels.com/photos/6445/sign-pencil-black-pencils.jpg",
      sentiment: "positivo",
      textColor: "text-gray-900" // Nero
    },
    {
      id: 4,
      categoria: "CUCINA",
      titolo: "I segreti del Sushi millenario",
      riassunto: "L'arte dei maestri giapponesi arriva finalmente nelle nostre cucine.",
      immagine: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
      sentiment: "positivo",
      textColor: "text-orange-400" // Arancione
    },
    {
      id: 5,
      categoria: "NATURA",
      titolo: "Il ritorno delle balene azzurre",
      riassunto: "Uno spettacolo incredibile avvistato al largo delle coste australiane.",
      immagine: "https://images.pexels.com/photos/4781938/pexels-photo-4781938.jpeg",
      sentiment: "positivo",
      textColor: "text-green-500" // Verde
    },
    {
      id: 6,
      categoria: "ECONOMIA",
      titolo: "Crisi dei mercati: crollo improvviso",
      riassunto: "Le borse europee chiudono in forte calo dopo le ultime decisioni sui tassi.",
      immagine: "https://images.pexels.com/photos/5833762/pexels-photo-5833762.jpeg",
      sentiment: "negativo",
      textColor: "text-red-500" // Rosso
    }
  ];

  // Configurazione Dinamica per la Sezione DEEP FLOW (Scegli il tema qui)
  const [temaDeepFlow, setTemaDeepFlow] = useState({
    titoloSottile: "CULTURE", // Titolo a destra
    coloreTema: "text-pink-500", // Colore per "Essenza del Flusso" e pulsante (Rosa per Cultura)
    testoTitolo: "La riscoperta delle tradizioni <span class='font-medium text-gray-950'>guida</span> il nuovo rinascimento creativo.",
    testoDescrizione: "L'analisi mostra un forte interesse per le radici storiche: l'85% degli utenti interagisce con contenuti d'arte digitale."
  });

=======
function App() {
  const scrollRef = useRef(null);

  // NOTIZIE (con colori e sentiment come prima)
  const notizie = [
    { 
      id: 1, 
      categoria: "DAL MONDO", 
      titolo: "Luci e colori dal Festival d'Oriente", 
      riassunto: "Un'esplosione di tradizioni che unisce i popoli in un abbraccio universale.", 
      immagine: "https://images.pexels.com/photos/36560064/pexels-photo-36560064.jpeg", 
      sentiment: "positivo",
      textColor: "text-blue-500" // Blu
    },
    { 
      id: 2, 
      categoria: "CULTURA", 
      titolo: "Il Rinascimento Digitale a Firenze", 
      riassunto: "Le opere del Botticelli prendono vita grazie alla realtà aumentata e all'IA.", 
      immagine: "https://images.pexels.com/photos/2372977/pexels-photo-2372977.jpeg", 
      sentiment: "positivo",
      textColor: "text-pink-500" // Rosa
    },
    { 
      id: 3, 
      categoria: "DESIGN", 
      titolo: "L'estetica del silenzio moderno", 
      riassunto: "Come il minimalismo trasforma le nostre case in oasi di luce e pace.", 
      immagine: "https://images.pexels.com/photos/6445/sign-pencil-black-pencils.jpg", 
      sentiment: "positivo",
      textColor: "text-gray-900" // Nero
    },
    { 
      id: 4, 
      categoria: "CUCINA", 
      titolo: "I segreti del Sushi millenario", 
      riassunto: "L'arte dei maestri giapponesi arriva finalmente nelle nostre cucine.", 
      immagine: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg", 
      sentiment: "positivo",
      textColor: "text-orange-400" // Arancione
    },
    { 
      id: 5, 
      categoria: "NATURA", 
      titolo: "Il ritorno delle balene azzurre", 
      riassunto: "Uno spettacolo incredibile avvistato al largo delle coste australiane.", 
      immagine: "https://images.pexels.com/photos/4781938/pexels-photo-4781938.jpeg", 
      sentiment: "positivo",
      textColor: "text-green-500" // Verde
    },
    { 
      id: 6, 
      categoria: "ECONOMIA", 
      titolo: "Crisi dei mercati: crollo improvviso", 
      riassunto: "Le borse europee chiudono in forte calo dopo le ultime decisioni sui tassi.", 
      immagine: "https://images.pexels.com/photos/5833762/pexels-photo-5833762.jpeg", 
      sentiment: "negativo",
      textColor: "text-red-500" // Rosso
    }
  ];

<<<<<<< HEAD
>>>>>>> fdbac5e (Prima pagina completata)
=======
  // Configurazione Dinamica per la Sezione DEEP FLOW (Scegli il tema qui)
  const [temaDeepFlow, setTemaDeepFlow] = useState({
    titoloSottile: "CULTURE", // Titolo a destra
    coloreTema: "text-pink-500", // Colore per "Essenza del Flusso" e pulsante (Rosa per Cultura)
    testoTitolo: "La riscoperta delle tradizioni <span class='font-medium text-gray-950'>guida</span> il nuovo rinascimento creativo.",
    testoDescrizione: "L'analisi mostra un forte interesse per le radici storiche: l'85% degli utenti interagisce con contenuti d'arte digitale."
  });

>>>>>>> b20b985 (modifiche)
  const scroll = (direction) => {
    if (direction === 'left') scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    else scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <InputBar />

        {/* --- SEZIONE 1: DAILY BREAKING (TUTTO NERO) --- */}
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl tracking-[-0.04em] text-gray-900 uppercase">
              <span className="font-light">DAILY</span> <span className="font-bold">BREAKING</span>
            </h2>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <div className="relative group">
            <button onClick={() => scroll('left')} className="absolute left-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">←</button>
            <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 px-2 scroll-smooth">
              {notizie.map((n) => <NewsCard key={n.id} {...n} />)}
            </div>
            <button onClick={() => scroll('right')} className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">→</button>
          </div>
        </section>

        {/* --- SEZIONE 2: DEEP FLOW (DINAMICA E COLORATA) --- */}
        <section className="mt-24 border-t border-gray-100 pt-16">
          <div className="flex items-center gap-4 mb-14">
            <h2 className="text-2xl tracking-[-0.05em] text-gray-900 uppercase">
              <span className="font-bold">DEEP</span> <span className="font-extralight text-gray-400">FLOW</span>
            </h2>
            <div className="h-[px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.4em] uppercase">{temaDeepFlow.titoloSottile}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {/* Card Bianca: Il colore dell'etichetta è dinamico */}
            <div className="col-span-2 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
              <span className={`text-[9px] font-bold tracking-[0.3em] uppercase mb-8 block ${temaDeepFlow.coloreTema}`}>
                Essenza del Flusso
              </span>
              <h3 className="text-3xl font-light tracking-[-0.03em] text-gray-900 mb-6 leading-snug" dangerouslySetInnerHTML={{ __html: temaDeepFlow.testoTitolo }}></h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-2xl">
                {temaDeepFlow.testoDescrizione}
              </p>
              <div className="w-full h-[1px] bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-3/4 bg-black transition-all duration-[2s]"></div>
              </div>
            </div>

            {/* Card Nera: Il colore del pulsante al passaggio del mouse è dinamico */}
            <div className="bg-black p-10 rounded-2xl text-white flex flex-col justify-between">
              <div>
                <h4 className="text-[9px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-8">Data Points</h4>
                <p className="text-2xl font-extralight tracking-tight leading-snug">Interesse per le arti visive in aumento del 18%.</p>
              </div>
              <button className={`text-[9px] font-bold tracking-[0.4em] uppercase border-b border-white/20 pb-2 self-start transition-all mt-10 ${temaDeepFlow.coloreTema ? `hover:border-pink-500` : `hover:border-white`}`}>
                Esplora {temaDeepFlow.titoloSottile}
              </button>
            </div>
          </div>
        </section>
>>>>>>> d4112a9 (modifiche)
      </main>
<<<<<<< HEAD

    </div>
<<<<<<< HEAD

  );

}



export default App;
=======
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
          NewsFlow 🚀
        </h1>
        <p className="text-gray-600 text-lg">
          Benvenuta Mary! Tailwind è attivo e funzionante.
        </p>
        <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
          Iniziamo a creare!
        </button>
      </div>
=======
=======
    <div>
      <Navbar /> {/* Questo richiama il tuo disegno blu! */}
      <div className="p-10 text-center">
         <h1 className="text-3xl font-bold">NewsFlow 🚀</h1>
         <p>Benvenuta Mary!</p>
      </div>
>>>>>>> 4e5926e (Mary: Navbar colorata e funzionante con Tailwind)
<<<<<<< HEAD
>>>>>>> b1813d6 (Mary: Navbar colorata e funzionante con Tailwind)
=======
=======
    <div className="min-h-screen bg-gray-50">
=======
    <div className="min-h-screen bg-gray-100">
>>>>>>> cb18165 (Mary: Sito in progress)
=======
    <div className="min-h-screen bg-white">
>>>>>>> fdbac5e (Prima pagina completata)
=======
    <div className="min-h-screen bg-white font-sans antialiased">
>>>>>>> b20b985 (modifiche)
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <InputBar />

        {/* --- SEZIONE 1: DAILY BREAKING (TUTTO NERO) --- */}
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl tracking-[-0.04em] text-gray-900 uppercase">
              <span className="font-light">DAILY</span> <span className="font-bold">BREAKING</span>
            </h2>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <div className="relative group">
            <button onClick={() => scroll('left')} className="absolute left-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">←</button>
            <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 px-2 scroll-smooth">
              {notizie.map((n) => <NewsCard key={n.id} {...n} />)}
            </div>
            <button onClick={() => scroll('right')} className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">→</button>
          </div>
        </section>

        {/* --- SEZIONE 2: DEEP FLOW (DINAMICA E COLORATA) --- */}
        <section className="mt-24 border-t border-gray-100 pt-16">
          <div className="flex items-center gap-4 mb-14">
            <h2 className="text-2xl tracking-[-0.05em] text-gray-900 uppercase">
              <span className="font-bold">DEEP</span> <span className="font-extralight text-gray-400">FLOW</span>
            </h2>
            <div className="h-[px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.4em] uppercase">{temaDeepFlow.titoloSottile}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {/* Card Bianca: Il colore dell'etichetta è dinamico */}
            <div className="col-span-2 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
              <span className={`text-[9px] font-bold tracking-[0.3em] uppercase mb-8 block ${temaDeepFlow.coloreTema}`}>
                Essenza del Flusso
              </span>
              <h3 className="text-3xl font-light tracking-[-0.03em] text-gray-900 mb-6 leading-snug" dangerouslySetInnerHTML={{ __html: temaDeepFlow.testoTitolo }}></h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-2xl">
                {temaDeepFlow.testoDescrizione}
              </p>
              <div className="w-full h-[1px] bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-3/4 bg-black transition-all duration-[2s]"></div>
              </div>
            </div>

            {/* Card Nera: Il colore del pulsante al passaggio del mouse è dinamico */}
            <div className="bg-black p-10 rounded-2xl text-white flex flex-col justify-between">
              <div>
                <h4 className="text-[9px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-8">Data Points</h4>
                <p className="text-2xl font-extralight tracking-tight leading-snug">Interesse per le arti visive in aumento del 18%.</p>
              </div>
              <button className={`text-[9px] font-bold tracking-[0.4em] uppercase border-b border-white/20 pb-2 self-start transition-all mt-10 ${ temaDeepFlow.coloreTema ? `hover:border-pink-500` : `hover:border-white` }`}>
                Esplora {temaDeepFlow.titoloSottile}
              </button>
            </div>
          </div>
        </section>
      </main>
>>>>>>> 3e11775 (Mary: Aggiunta la prima NewsCard per le notizie)
<<<<<<< HEAD
>>>>>>> f9d6553 (Mary: Aggiunta la prima NewsCard per le notizie)
=======
=======
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
          NewsFlow 🚀
        </h1>
        <p className="text-gray-600 text-lg">
          Benvenuta Mary! Tailwind è attivo e funzionante.
        </p>
        <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
          Iniziamo a creare!
        </button>
      </div>
>>>>>>> e979906 (Mary: Inizializzato frontend e creata Navbar)
<<<<<<< HEAD
>>>>>>> 0ff4481 (Mary: Inizializzato frontend e creata Navbar)
=======
=======
    immagine: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500"
  }
];

=======
>>>>>>> 4853613 (modifiche)
function App() {
  const scrollRef = useRef(null);

  // NOTIZIE (con colori e sentiment come prima)
  const notizie = [
    { 
      id: 1, 
      categoria: "DAL MONDO", 
      titolo: "Luci e colori dal Festival d'Oriente", 
      riassunto: "Un'esplosione di tradizioni che unisce i popoli in un abbraccio universale.", 
      immagine: "https://images.pexels.com/photos/36560064/pexels-photo-36560064.jpeg", 
      sentiment: "positivo",
      textColor: "text-blue-500" // Blu
    },
    { 
      id: 2, 
      categoria: "CULTURA", 
      titolo: "Il Rinascimento Digitale a Firenze", 
      riassunto: "Le opere del Botticelli prendono vita grazie alla realtà aumentata e all'IA.", 
      immagine: "https://images.pexels.com/photos/2372977/pexels-photo-2372977.jpeg", 
      sentiment: "positivo",
      textColor: "text-pink-500" // Rosa
    },
    { 
      id: 3, 
      categoria: "DESIGN", 
      titolo: "L'estetica del silenzio moderno", 
      riassunto: "Come il minimalismo trasforma le nostre case in oasi di luce e pace.", 
      immagine: "https://images.pexels.com/photos/6445/sign-pencil-black-pencils.jpg", 
      sentiment: "positivo",
      textColor: "text-gray-900" // Nero
    },
    { 
      id: 4, 
      categoria: "CUCINA", 
      titolo: "I segreti del Sushi millenario", 
      riassunto: "L'arte dei maestri giapponesi arriva finalmente nelle nostre cucine.", 
      immagine: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg", 
      sentiment: "positivo",
      textColor: "text-orange-400" // Arancione
    },
    { 
      id: 5, 
      categoria: "NATURA", 
      titolo: "Il ritorno delle balene azzurre", 
      riassunto: "Uno spettacolo incredibile avvistato al largo delle coste australiane.", 
      immagine: "https://images.pexels.com/photos/4781938/pexels-photo-4781938.jpeg", 
      sentiment: "positivo",
      textColor: "text-green-500" // Verde
    },
    { 
      id: 6, 
      categoria: "ECONOMIA", 
      titolo: "Crisi dei mercati: crollo improvviso", 
      riassunto: "Le borse europee chiudono in forte calo dopo le ultime decisioni sui tassi.", 
      immagine: "https://images.pexels.com/photos/5833762/pexels-photo-5833762.jpeg", 
      sentiment: "negativo",
      textColor: "text-red-500" // Rosso
    }
  ];

  // Configurazione Dinamica per la Sezione DEEP FLOW (Scegli il tema qui)
  const [temaDeepFlow, setTemaDeepFlow] = useState({
    titoloSottile: "CULTURE", // Titolo a destra
    coloreTema: "text-pink-500", // Colore per "Essenza del Flusso" e pulsante (Rosa per Cultura)
    testoTitolo: "La riscoperta delle tradizioni <span class='font-medium text-gray-950'>guida</span> il nuovo rinascimento creativo.",
    testoDescrizione: "L'analisi mostra un forte interesse per le radici storiche: l'85% degli utenti interagisce con contenuti d'arte digitale."
  });

  const scroll = (direction) => {
    if (direction === 'left') scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    else scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <InputBar />

        {/* --- SEZIONE 1: DAILY BREAKING (TUTTO NERO) --- */}
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl tracking-[-0.04em] text-gray-900 uppercase">
              <span className="font-light">DAILY</span> <span className="font-bold">BREAKING</span>
            </h2>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <div className="relative group">
            <button onClick={() => scroll('left')} className="absolute left-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">←</button>
            <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide pb-10 px-2 scroll-smooth">
              {notizie.map((n) => <NewsCard key={n.id} {...n} />)}
            </div>
            <button onClick={() => scroll('right')} className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">→</button>
          </div>
        </section>

        {/* --- SEZIONE 2: DEEP FLOW (DINAMICA E COLORATA) --- */}
        <section className="mt-24 border-t border-gray-100 pt-16">
          <div className="flex items-center gap-4 mb-14">
            <h2 className="text-2xl tracking-[-0.05em] text-gray-900 uppercase">
              <span className="font-bold">DEEP</span> <span className="font-extralight text-gray-400">FLOW</span>
            </h2>
            <div className="h-[px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.4em] uppercase">{temaDeepFlow.titoloSottile}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {/* Card Bianca: Il colore dell'etichetta è dinamico */}
            <div className="col-span-2 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
              <span className={`text-[9px] font-bold tracking-[0.3em] uppercase mb-8 block ${temaDeepFlow.coloreTema}`}>
                Essenza del Flusso
              </span>
              <h3 className="text-3xl font-light tracking-[-0.03em] text-gray-900 mb-6 leading-snug" dangerouslySetInnerHTML={{ __html: temaDeepFlow.testoTitolo }}></h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-2xl">
                {temaDeepFlow.testoDescrizione}
              </p>
              <div className="w-full h-[1px] bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-3/4 bg-black transition-all duration-[2s]"></div>
              </div>
            </div>

            {/* Card Nera: Il colore del pulsante al passaggio del mouse è dinamico */}
            <div className="bg-black p-10 rounded-2xl text-white flex flex-col justify-between">
              <div>
                <h4 className="text-[9px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-8">Data Points</h4>
                <p className="text-2xl font-extralight tracking-tight leading-snug">Interesse per le arti visive in aumento del 18%.</p>
              </div>
              <button className={`text-[9px] font-bold tracking-[0.4em] uppercase border-b border-white/20 pb-2 self-start transition-all mt-10 ${ temaDeepFlow.coloreTema ? `hover:border-pink-500` : `hover:border-white` }`}>
                Esplora {temaDeepFlow.titoloSottile}
              </button>
            </div>
          </div>
        </section>
      </main>
>>>>>>> 7301184 (Mary: Inizializzato frontend e creata Navbar)
>>>>>>> c9cec4b (Mary: Inizializzato frontend e creata Navbar)
    </div>
  );
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export default App
>>>>>>> e6ea500 (Mary: Inizializzato frontend e creata Navbar)
=======
  )
}

export default App
>>>>>>> 6d50b4c (Mary: Inizializzato frontend e creata Navbar)
=======
export default App;
>>>>>>> b1813d6 (Mary: Navbar colorata e funzionante con Tailwind)
=======
export default App
>>>>>>> 0ff4481 (Mary: Inizializzato frontend e creata Navbar)
=======
export default App;
>>>>>>> 4dbc369 (chore: Risolti conflitti dando priorita' a backend locale e frontend di Mary)
