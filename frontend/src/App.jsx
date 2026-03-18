import Navbar from "./components/Navbar";
import NewsCard from "./components/NewsCard"; // Prendi la figurina dalla scatola!

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto p-10">
        <h2 className="text-3xl font-black mb-8 text-center">Ultime Notizie ✨</h2>
        
        {/* Ecco la tua NewsCard! */}
        <div className="flex justify-center">
          <NewsCard />
        </div>
      </main>
    </div>
  );
}

export default App;