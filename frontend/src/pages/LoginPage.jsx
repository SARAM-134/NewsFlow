import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simuliamo un login e andiamo alla dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-3xl font-serif font-bold mb-8">Accesso NewsFlow</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm px-6">
          <input type="email" placeholder="Email" className="p-3 border border-gray-200 rounded" />
          <input type="password" placeholder="Password" className="p-3 border border-gray-200 rounded" />
          <button type="submit" className="bg-black text-white py-3 rounded uppercase tracking-widest text-xs font-bold hover:bg-gray-800">Accedi</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;