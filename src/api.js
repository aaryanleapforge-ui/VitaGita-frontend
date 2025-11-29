import axios from 'axios';

// In development default to the relative '/api' so CRA dev server proxy forwards
// requests to the local backend (http://localhost:5000). In production set
// `REACT_APP_API_URL` to the full API base URL.
const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
