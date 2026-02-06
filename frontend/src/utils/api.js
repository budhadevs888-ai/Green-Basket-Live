import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (error.response?.data?.detail?.includes('suspended') ||
          error.response?.data?.detail?.includes('Invalid token')) {
        localStorage.removeItem('gb_token');
        localStorage.removeItem('gb_user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
