import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getCategories, getProfile } from '../services/api'; // api is default export
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resProf] = await Promise.all([getCategories(), getProfile()]);
        setCategories(resCat.data.results || resCat.data);
        setProfile(resProf.data);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  const handleToggleCategory = (catId) => {
    // Implementazione futura: aggiornamento categorie preferite via API
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased pt-0">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16">
          <h1 className="text-5xl font-serif font-bold tracking-tight mb-4 text-gray-900">Il Tuo Profilo</h1>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-bold italic">Personalizza il tuo flusso informativo</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Info Utente */}
          <div className="space-y-10">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-4">Dati Personali</label>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nome</p>
                  <p className="text-xl font-medium">{profile?.first_name || 'Non specificato'}</p>
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-xl font-medium">{profile?.email}</p>
                  </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ruolo</p>
                  <p className="text-xl font-medium italic text-blue-600">{profile?.ruolo}</p>
                </div>
              </div>
            </div>
            
            <button className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl">
              Salva Modifiche
            </button>
          </div>

          {/* Categorie Preferite */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-8">Categorie del Flusso</label>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => handleToggleCategory(cat.id)}
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all cursor-pointer group shadow-sm border border-gray-100"
                >
                  <span className="text-sm font-bold uppercase tracking-widest">{cat.nome}</span>
                  <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-white transition-colors">
                    <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-white" />
                  </div>
                </div>
              ))}
            </div>
            {success && <p className="mt-6 text-green-500 font-bold text-xs animate-bounce italic">✓ Preferenze aggiornate.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
