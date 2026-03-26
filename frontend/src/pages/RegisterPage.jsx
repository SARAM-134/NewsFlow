import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    cognome: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await registerUser(formData);
      // Dopo la registrazione, reindirizziamo al login con un messaggio di successo
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante la registrazione. Riprova con dati diversi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-6">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900 mb-2">Unisciti a NewsFlow</h1>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light">Crea il tuo account gratuito</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 text-xs rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Username</label>
              <input 
                name="username"
                type="text" 
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="mario_rossi" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Nome</label>
              <input 
                name="nome"
                type="text" 
                value={formData.nome}
                onChange={handleChange}
                placeholder="Mario" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Cognome</label>
              <input 
                name="cognome"
                type="text" 
                value={formData.cognome}
                onChange={handleChange}
                placeholder="Rossi" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
              <input 
                name="email"
                type="email" 
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="mario.rossi@esempio.com" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <input 
                name="password"
                type="password" 
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Conferma Password</label>
              <input 
                name="confirmPassword"
                type="password" 
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="md:col-span-2 mt-4 bg-black text-white py-5 rounded-xl uppercase tracking-[0.3em] text-xs font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <p className="text-xs text-gray-400 mb-4">Hai già un account?</p>
            <button onClick={() => navigate('/login')} className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black hover:text-gray-600 transition-colors pb-1">
              Accedi qui
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
