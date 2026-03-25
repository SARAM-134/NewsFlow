import React from 'react';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  // Dati mock per la demo (in futuro arriveranno dalle API)
  const user = { nome: "Mario", ruolo: "Giornalista" };
  const stats = [
    { label: 'Notizie Lette', value: '124', color: 'bg-blue-500' },
    { label: 'Salvati', value: '18', color: 'bg-emerald-500' },
    { label: 'Report Generati', value: '7', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* La Navbar è condivisa */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header di Benvenuto */}
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Bentornato, <span className="text-gray-500 font-light italic">{user.nome}</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Panoramica {user.ruolo}
          </p>
        </div>

        {/* Griglia Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-default">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-4xl font-serif font-medium text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-full opacity-20 ${stat.color}`}></div>
            </div>
          ))}
        </div>

        {/* Sezione Contenuto Principale */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold tracking-tight">Le tue Notizie Salvate</h2>
            <button className="text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline">Vedi tutte</button>
          </div>
          
          {/* Placeholder contenuto vuoto */}
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Non hai ancora salvato nessuna notizia.</p>
            <p className="text-gray-400 text-xs mt-1">Esplora il feed per iniziare a creare la tua rassegna stampa.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;