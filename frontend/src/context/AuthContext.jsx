import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { login as apiLogin, register as apiRegister, getProfile, logout as apiLogout, setAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutUser = async (force = false) => {
    if (!force) {
      const refresh = localStorage.getItem('refresh_token');
      try {
        if (refresh) await apiLogout(refresh);
      } catch (e) {
        console.error("Errore durante il logout API:", e);
      }
    }
    
    // Pulizia locale
    setAccessToken(null);
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  useEffect(() => {
    // Gestione scadenza sessione (es. refresh fallito)
    const handleAuthExpired = () => {
      logoutUser(true);
      window.location.href = '/login?expired=true';
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    const initAuth = async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Tentiamo il refresh iniziale per ottenere un access token in memoria
          const res = await api.post('auth/refresh/', { refresh: refreshToken });
          setAccessToken(res.data.access);
          
          // Carichiamo il profilo
          const profileRes = await getProfile();
          setUser(profileRes.data);
        } catch (err) {
          console.error("Sessione non valida all'avvio");
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();

    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const loginUser = async (credentials) => {
    const res = await apiLogin(credentials);
    const { access, refresh, user: userData } = res.data;
    
    setAccessToken(access);
    localStorage.setItem('refresh_token', refresh);
    setUser(userData);
    return res.data;
  };

  const registerUser = async (data) => {
    const res = await apiRegister(data);
    // Dopo la registrazione, l'utente potrebbe dover fare il login manuale 
    // o comparire come loggato se l'API restituisce i token.
    // La traccia suggerisce che register crea l'utente.
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, registerUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
