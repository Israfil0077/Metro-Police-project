// API Utility for making backend calls
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const DEMO = import.meta.env.VITE_DEMO === 'true';

// Demo mode (GitHub Pages build): there is no backend, so answer every request in the browser.
// Login works with any password; the role comes from the email (admin@..., officer@..., anything else = citizen).
// Every other request returns an empty result, so pages show their empty state instead of an error.
const emptyResult = () =>
  new Proxy([], {
    get: (target, key) => (key in target ? target[key] : typeof key === 'string' ? [] : undefined),
  });

const demoUser = (email = 'citizen@demo.com') => {
  const role = email.startsWith('admin') ? 'admin' : email.startsWith('officer') ? 'officer' : 'citizen';
  const name = { admin: 'Demo Admin', officer: 'Demo Officer', citizen: 'Demo Citizen' }[role];
  return { id: 1, name, full_name: name, email, role };
};

const demoAdapter = async (config) => {
  const url = config.url || '';
  const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
  let data;
  if (url.startsWith('/auth/login') || url.startsWith('/auth/register')) {
    const user = demoUser(body.email);
    localStorage.setItem('user', JSON.stringify(user));
    data = { success: true, token: 'demo-token', user, message: 'Demo mode: nothing is saved.' };
  } else if (url.startsWith('/auth/me')) {
    data = { success: true, user: JSON.parse(localStorage.getItem('user') || 'null') || demoUser() };
  } else if (config.method !== 'get') {
    data = { success: true, message: 'Demo mode: this action is not saved.' };
  } else {
    data = emptyResult();
  }
  return { data, status: 200, statusText: 'OK', headers: {}, config };
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  ...(DEMO ? { adapter: demoAdapter } : {})
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = `${import.meta.env.BASE_URL}login`;
    }
    return Promise.reject(error);
  }
);

export default api;
