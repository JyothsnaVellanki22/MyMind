import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const AI_API_URL = import.meta.env.VITE_AI_API_URL || '/ai';
const AI_SERVICE_TOKEN = import.meta.env.VITE_AI_SERVICE_TOKEN || 'dev-token';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const res = await axios.post(`${API_URL}/auth/login`, formData);
    localStorage.setItem('token', res.data.access_token);
    return res.data;
  },
  register: async (email, password, name) => {
    return axios.post(`${API_URL}/auth/register`, { email, password, name });
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const journalService = {
  getAll: () => api.get('/journals'),
  getById: (id) => api.get(`/journals/${id}`),
  create: (data) => api.get('/journals', data), // Wait, create should be post
  update: (id, data) => api.put(`/journals/${id}`, data),
  delete: (id) => api.delete(`/journals/${id}`), // Need to add this to backend too
};

// Fix the create method
journalService.create = (data) => api.post('/journals', data);

export const todoService = {
  getAll: () => api.get('/todos'),
  create: (content) => api.post('/todos', { content }),
  toggle: (id, completed) => api.put(`/todos/${id}`, { completed }),
  delete: (id) => api.delete(`/todos/${id}`),
};

export const visionService = {
  getAll: () => api.get('/visions'),
  create: (data) => api.post('/visions', data),
  toggle: (id, completed) => api.put(`/visions/${id}`, { completed }),
  delete: (id) => api.delete(`/visions/${id}`),
};

export const aiService = {
  analyze: (title, content) => axios.post(`${AI_API_URL}/analyze`, { title, content }, {
    headers: { 'X-AI-Service-Token': AI_SERVICE_TOKEN }
  }),
  chat: (history, message, journal_context) => axios.post(`${AI_API_URL}/chat`, { history, message, journal_context }, {
    headers: { 'X-AI-Service-Token': AI_SERVICE_TOKEN }
  }),
};

export default api;
