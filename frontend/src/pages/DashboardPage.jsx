import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getStats, getStatsIngestion, triggerFetch } from '../services/api';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Errore nel caricamento statistiche:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { label: 'Notizie nel Catalogo', value: stats?.total_notizie || '0', color: 'bg-blue-500' },
    { label: 'Analisi AI Completate', value: stats?.notizie_elaborate_ai || '0', color: 'bg-emerald-500' },
    { label: 'Fonti Connesse', value: stats?.fonti_attive || '0', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
            Bentornato, <span className="text-gray-400 font-light italic">{user?.first_name || user?.email || 'Membro'}</span>
          </h1>
          <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-[0.3em] flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Panoramica {user?.ruolo || 'Utente'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {statItems.map((stat, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-xl transition-all duration-500 cursor-default group">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-black transition-colors">{stat.label}</p>
                <p className="text-5xl font-serif font-medium text-gray-900">{loading ? '...' : stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl opacity-10 group-hover:opacity-100 transition-all duration-500 ${stat.color} p-3 flex items-center justify-center`}>
                 <div className="w-full h-full bg-white/20 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Sezione Contenuto Principale: Salvati */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 min-h-[300px] mb-12 flex flex-col">
          <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-8">
            <h2 className="text-xl font-bold tracking-tight uppercase">Le tue Notizie Salvate</h2>
            <button className="text-[10px] font-bold text-gray-300 uppercase tracking-widest hover:text-black transition-colors">Vedi tutte</button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
            <p className="text-gray-400 text-sm font-light italic">Nessuna notizia salvata.</p>
          </div>
        </div>

        {/* --- SEZIONE ADMIN: GESTIONE FONTI --- */}
        {user?.ruolo === 'admin' && <AdminIngestionSection />}

      </div>
    </div>
  );
};

// Sotto-componente per la gestione Admin
const AdminIngestionSection = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIngestion = async () => {
    try {
      const res = await getStatsIngestion();
      setSources(res.data.ingestion_status);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchIngestion(); }, []);

  const handleFetch = async (id) => {
    try {
      await triggerFetch(id);
      alert("Fetch avviato!");
      fetchIngestion();
    } catch (e) { alert("Errore nell'avvio del fetch."); }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
      <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-8">
        <h2 className="text-xl font-bold tracking-tight uppercase text-blue-600">Gestione Ingestion (Admin)</h2>
        <button onClick={fetchIngestion} className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-black transition-colors">🔄 Aggiorna</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
              <th className="pb-4">Fonte</th>
              <th className="pb-4">Ultimo Aggiornamento</th>
              <th className="pb-4">Stato</th>
              <th className="pb-4">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sources && sources.map((src, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-6 font-bold text-xs">{src.nome}</td>
                <td className="py-6 text-xs text-gray-400 font-light">{src.ultimo_fetch ? new Date(src.ultimo_fetch).toLocaleString() : 'Mai'}</td>
                <td className="py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold ${src.num_errori_consecutivi > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {src.num_errori_consecutivi > 0 ? `ERRORE (${src.num_errori_consecutivi})` : 'OK'}
                  </span>
                </td>
                <td className="py-6 text-right">
                  <button onClick={() => handleFetch(1)} className="text-[10px] font-bold uppercase text-blue-500 hover:scale-105 transition-transform">Fetch Now</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;