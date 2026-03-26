import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getCategories, getProfile, updateProfile } from '../services/api';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [profileData, setProfileData] = useState({ 
    nome: '', 
    cognome: '', 
    email: '', 
    role: '',
    ai_provider: 'gemini',
    gemini_api_key: '',
    groq_api_key: '',
    ollama_model: 'llama3'
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resProf] = await Promise.all([getCategories(), getProfile()]);
        setCategories(resCat.data.results || resCat.data);
        setProfileData(resProf.data);
        // Pre-carica le categorie preferite dall'utente
        setSelectedCategories(resProf.data.categorie_preferite || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleToggleCategory = (id) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ 
        nome: profileData.nome, 
        cognome: profileData.cognome,
        categorie_preferite: selectedCategories,
        ai_provider: profileData.ai_provider,
        gemini_api_key: profileData.gemini_api_key,
        groq_api_key: profileData.groq_api_key,
        ollama_model: profileData.ollama_model
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
      <main className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-16">
          <h1 className="text-5xl font-serif font-bold tracking-tight mb-4 text-gray-900">Il Tuo Profilo</h1>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-bold italic">Personalizza il tuo flusso e l'IA</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Info Utente */}
          <div className="space-y-10 lg:col-span-1">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-8">Dati Personali</label>
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome</p>
                  <input 
                    type="text" 
                    value={profileData.nome || ''} 
                    onChange={(e) => setProfileData({...profileData, nome: e.target.value})}
                    className="w-full bg-gray-50 border-b border-gray-100 p-4 text-lg font-medium focus:outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Cognome</p>
                  <input 
                    type="text" 
                    value={profileData.cognome || ''} 
                    onChange={(e) => setProfileData({...profileData, cognome: e.target.value})}
                    className="w-full bg-gray-50 border-b border-gray-100 p-4 text-lg font-medium focus:outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email (Sola Lettura)</p>
                  <p className="p-4 text-lg font-light text-gray-400">{profileData.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Configurazione AI (Novità) */}
          <div className="space-y-10 lg:col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-8">Configurazione Motore AI</label>
            <div className="space-y-8 bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">AI Provider Predefinito</p>
                <select 
                  value={profileData.ai_provider}
                  onChange={(e) => setProfileData({...profileData, ai_provider: e.target.value})}
                  className="w-full bg-white border border-gray-100 p-4 text-sm font-bold uppercase tracking-widest rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="groq">Groq (Llama 3)</option>
                  <option value="ollama">Ollama (Locale)</option>
                </select>
              </div>

              {profileData.ai_provider === 'gemini' && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Gemini API Key</p>
                  <input 
                    type="password" 
                    placeholder="Alza-................"
                    value={profileData.gemini_api_key || ''} 
                    onChange={(e) => setProfileData({...profileData, gemini_api_key: e.target.value})}
                    className="w-full bg-white border border-gray-100 p-4 text-xs font-mono rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              )}

              {profileData.ai_provider === 'groq' && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Groq API Key</p>
                  <input 
                    type="password" 
                    placeholder="gsk-................"
                    value={profileData.groq_api_key || ''} 
                    onChange={(e) => setProfileData({...profileData, groq_api_key: e.target.value})}
                    className="w-full bg-white border border-gray-100 p-4 text-xs font-mono rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              )}

              {profileData.ai_provider === 'ollama' && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Modello Ollama (Locale)</p>
                  <input 
                    type="text" 
                    placeholder="llama3, mistral, gemma..."
                    value={profileData.ollama_model || ''} 
                    onChange={(e) => setProfileData({...profileData, ollama_model: e.target.value})}
                    className="w-full bg-white border border-gray-100 p-4 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                  <p className="text-[8px] text-gray-400 italic">Assicurati che Ollama sia in esecuzione localmente sulla porta 11434.</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-black text-white py-5 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Assimilazione...' : 'Salva Tutte le Modifiche'}
            </button>
            {success && <p className="text-green-500 font-bold text-[10px] uppercase tracking-widest animate-fade-in mt-4 italic text-center">✓ Profilo & IA sincronizzati</p>}
          </div>

          {/* Categorie Preferite Reali */}
          <div className="lg:col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-8">Interessi & Personalizzazione</label>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-hide">
              {categories.map((cat) => {
                const isActive = selectedCategories.includes(cat.id);
                return (
                  <div 
                    key={cat.id} 
                    onClick={() => handleToggleCategory(cat.id)}
                    className={`flex items-center justify-between p-6 rounded-2xl border-l-[6px] transition-all cursor-pointer group ${isActive ? 'bg-black border-black text-white shadow-xl translate-x-1' : 'bg-gray-50 border-transparent text-gray-600 hover:border-gray-200'}`}
                  >
                    <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-600'}`}>{cat.nome}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isActive ? 'border-white/20' : 'border-gray-200'}`}>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-8 text-[9px] text-gray-400 uppercase tracking-widest italic leading-relaxed font-medium">
              ★ Il tuo feed <span className="text-black">"Per Te"</span> utilizzerà queste categorie per filtrare i riassunti AI prioritari.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
