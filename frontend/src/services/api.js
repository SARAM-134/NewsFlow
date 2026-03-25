import axios from 'axios';

// Vite espone le variabili d'ambiente con import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getNotizie = async () => {
  try {
    const response = await api.get('notizie/');
    return response.data; // DRF con pagination restituisce { count, next, previous, results: [...] } ... o direttamente la lista.
  } catch (error) {
    console.error("Errore durante il fetch delle notizie:", error);
    throw error;
  }
};

export default api;
