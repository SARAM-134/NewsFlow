import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token JWT se presente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH ---
export const login = (credentials) => api.post('accounts/login/', credentials);
export const getProfile = () => api.get('accounts/perfil/');
export const logout = (refreshToken) => api.post('accounts/logout/', { refresh: refreshToken });

// --- NOTIZIE & RICERCA ---
export const getNotizie = (params) => api.get('notizie/', { params });
export const getCategories = () => api.get('categorie/');
export const getTags = () => api.get('tags/');
export const searchSemantic = (q) => api.get('notizie/search-semantic/', { params: { q } });

// --- ADMIN & STATS ---
export const getStats = () => api.get('stats/');
export const getStatsIngestion = () => api.get('stats/ingestion/');
export const triggerFetch = (id) => api.post(`admin/fonti/${id}/fetch/`);

export default api;
