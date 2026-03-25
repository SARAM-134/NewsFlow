import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus('idle');
        setEmail('');
      }, 2500);
    }, 1000);
  };

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm group-hover:bg-gray-800 transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center h-8">
                  <span className="text-xl font-serif font-bold tracking-tighter text-gray-900 leading-none">
                    NEWS FLOW
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 leading-none mt-0.5 font-sans">
                    NEWS INTELLIGENCE
                  </span>
                </div>
              </Link>
          </div>

          <div className="flex items-center gap-6">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">
                    Accedi
                </Link>
              )}
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-6 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all border border-black active:scale-95"
              >
                  Newsletter
              </button>
          </div>
        </div>
      </nav>

      {/* MODAL NEWSLETTER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-gray-900">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white relative z-10 w-full max-w-md p-8 shadow-2xl rounded-sm border border-gray-100">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2">Benvenuto.</h3>
                  <p className="text-sm text-gray-500">Iscrizione completata con successo.</p>
                </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2 block">Premium Insight</span>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Iscriviti alla Newsletter</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">Ricevi ogni mattina il riassunto intelligente delle notizie più importanti.</p>
                </div>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Il tuo indirizzo email" className="w-full bg-gray-50 border-b-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-400" />
                  <button type="submit" disabled={status === 'loading'} className="bg-black text-white w-full py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    {status === 'loading' ? 'Registrazione...' : 'Iscriviti Ora'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;