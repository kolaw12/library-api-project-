import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000'),
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(message);
  }
);

export default api;
