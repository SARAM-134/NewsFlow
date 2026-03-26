import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered')) {
      setSuccess('Registrazione completata con successo! Accedi ora.');
    }
    if (params.get('expired')) {
      setError('La sessione è scaduta. Per favore, effettua di nuovo l\'accesso.');
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await loginUser({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Credenziali non valide. Verifica email e password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] px-6">
        <div className="w-full max-w-sm">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900 mb-2">Accesso NewsFlow</h1>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light">Inserisci le tue credenziali</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 text-xs rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-lg animate-fade-in">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@newsflow.com" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-black text-white py-5 rounded-xl uppercase tracking-[0.3em] text-xs font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Entrata in corso...' : 'Accedi'}
            </button>
          </form>
          
          <div className="mt-10 text-center flex flex-col gap-4">
            <button onClick={() => navigate('/register')} className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black hover:text-gray-600 transition-colors pb-1 self-center">
              Crea un nuovo account
            </button>
            <button onClick={() => navigate('/')} className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors">
              Torna alla Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;