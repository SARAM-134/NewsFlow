import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar /> {/* Questo richiama il tuo disegno blu! */}
      <div className="p-10 text-center">
         <h1 className="text-3xl font-bold">NewsFlow 🚀</h1>
         <p>Benvenuta Mary!</p>
      </div>
    </div>
  );
}

export default App;