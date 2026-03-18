import Navbar from "./components/Navbar";
import InputBar from "./components/InputBar"; // Prendi la scatola!
import NewsCard from "./components/NewsCard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto">
        {/* La scatola dei messaggi va qui in alto! */}
        <InputBar />
        
        <h2 className="text-3xl font-black mb-8 text-center text-gray-800">
          Le tue figurine News ✨
        </h2>
        
        <div className="flex justify-center pb-20">
          <NewsCard />
        </div>
      </main>
    </div>
  );
}

export default App;