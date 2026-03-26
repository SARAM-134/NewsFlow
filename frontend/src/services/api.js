import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

// MEMORY STORAGE for access token (more secure than localStorage)
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token JWT se presente in memoria
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor per gestire il refresh automatico del token (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se riceviamo 401 e non è già un tentativo di refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}auth/refresh/`, { refresh: refreshToken });
          const newAccess = res.data.access;
          
          setAccessToken(newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Se il refresh fallisce, forziamo il logout (gestito dal Context)
          window.dispatchEvent(new Event('auth-expired'));
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- AUTH ---
export const login = (credentials) => api.post('auth/login/', credentials);
export const register = (data) => api.post('auth/register/', data); // Aggiunto per registrazione
export const getProfile = () => api.get('auth/me/');
export const updateProfile = (data) => api.patch('auth/me/', data);
export const logout = (refreshToken) => api.post('auth/logout/', { refresh: refreshToken });

// --- NOTIZIE & RICERCA ---
export const getNotizie = (params) => api.get('notizie/', { params });
export const getCategories = () => api.get('categorie/');
export const getTags = () => api.get('tags/');
export const searchSemantic = (q) => api.get('notizie/search-semantic/', { params: { q } });

// --- INTERAZIONI (SALVATI) ---
export const getSavedNews = () => api.get('interactions/saved/');
export const saveNews = (notiziaId) => api.post('interactions/saved/', { notizia: notiziaId });
export const deleteSavedNews = (id) => api.delete(`interactions/saved/${id}/`);

// --- ADMIN & STATS ---
export const getStats = () => api.get('stats/');
export const getStatsIngestion = () => api.get('stats/ingestion/');
export const triggerFetch = (id) => api.post(`admin/fonti/${id}/fetch/`);

export default api;
