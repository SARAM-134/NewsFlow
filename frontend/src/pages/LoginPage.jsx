// 1. Importi gli strumenti per cambiare pagina
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 2. Importi i tuoi pezzi di codice (i file .jsx che hai creato)
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import InputBar from './components/InputBar';
// ... import NewsCard etc.

function App() {
  return (
    <Router>
      <div className="App">
        {/* Qui dentro metti la logica per le rotte */}
        <Routes>
          
          {/* QUANDO VAI SU /login MOSTRA SOLO IL LOGIN */}
          <Route path="/login" element={<LoginPage />} />

          {/* QUANDO SEI SULLA HOME (/) MOSTRA NAVBAR + BARRA + NEWS */}
          <Route path="/" element={
            <>
              <Navbar /> 
              <InputBar />
              {/* Qui aggiungi il codice delle tue news che avevi prima */}
            </>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;