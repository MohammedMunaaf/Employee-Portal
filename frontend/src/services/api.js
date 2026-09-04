import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Request interceptor to attach JWT auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('portal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 unauthenticated globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('portal_token');
      localStorage.removeItem('portal_user');
    }
    return Promise.reject(error);
  }
);

export default API;
