import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { login as apiLogin, getProfile, logout as apiLogout } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await getProfile();
          setUser(res.data);
        } catch (err) {
          console.error("Sessione scaduta o non valida");
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const loginUser = async (credentials) => {
    const res = await apiLogin(credentials);
    const { access, refresh, user: userData } = res.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setUser(userData);
    return res.data;
  };

  const logoutUser = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) await apiLogout(refresh);
    } catch (e) {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
