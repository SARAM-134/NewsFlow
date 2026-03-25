import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getCategories, getProfile, updateProfile } from '../services/api';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [profileData, setProfileData] = useState({ first_name: '', last_name: '', email: '', ruolo: '' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resProf] = await Promise.all([getCategories(), getProfile()]);
        setCategories(resCat.data.results || resCat.data);
        setProfileData(resProf.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ 
        first_name: profileData.first_name, 
        last_name: profileData.last_name 
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-light text-gray-400 uppercase tracking-widest">Caricamento Profilo...</div>;

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
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-8">Dati Personali</label>
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome</p>
                  <input 
                    type="text" 
                    value={profileData.first_name || ''} 
                    onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    className="w-full bg-gray-50 border-b border-gray-100 p-4 text-lg font-medium focus:outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email (Sola Lettura)</p>
                  <p className="p-4 text-lg font-light text-gray-400">{profileData.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ruolo</p>
                  <p className="p-4 text-lg font-serif italic text-blue-600 uppercase tracking-widest">{profileData.ruolo}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white px-12 py-5 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Salvataggio...' : 'Salva Profilo'}
            </button>
            {success && <p className="text-green-500 font-bold text-[10px] uppercase tracking-widest animate-fade-in mt-4 italic">✓ Modifiche salvate con successo</p>}
          </div>

          {/* Categorie Preferite (Placeholder UI) */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-8">Interessi & Categorie</label>
            <div className="grid grid-cols-1 gap-4 opacity-70">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-none border-l-4 border-transparent hover:border-black transition-all cursor-default group"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">{cat.nome}</span>
                  <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[9px] text-gray-400 uppercase tracking-widest italic leading-relaxed">
              Il filtraggio automatico tramite AI sarà basato su queste preferenze nella fase 2 di NewsFlow.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
