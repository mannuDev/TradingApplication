import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);

// KYC APIs
export const submitKYC = (formData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/kyc/submit`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getKYCStatus = () => api.get('/kyc/status');

// Admin APIs
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAllUsers = () => api.get('/admin/users');
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const getPendingKYC = () => api.get('/admin/kyc/pending');
export const approveKYC = (userId) => api.patch(`/admin/kyc/${userId}/approve`);
export const rejectKYC = (userId, reason) => api.patch(`/admin/kyc/${userId}/reject`, { reason });
export const getAllTransactions = () => api.get('/admin/transactions');
export const toggleUserStatus = (userId) => api.patch(`/admin/users/${userId}/status`);
export const makeAdmin = (userId) => api.patch(`/admin/users/${userId}/make-admin`);

// Product APIs
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);

// Transaction APIs
export const buyProduct = (data) => api.post('/transactions/buy', data);
export const getTransactionHistory = () => api.get('/transactions/history');

// Portfolio APIs
export const getPortfolio = () => api.get('/portfolio');
export const getWalletBalance = () => api.get('/portfolio/wallet');

// Watchlist APIs
export const addToWatchlist = (productId) => api.post('/watchlist/add', { productId });
export const removeFromWatchlist = (productId) => api.delete(`/watchlist/remove/${productId}`);
export const getWatchlist = () => api.get('/watchlist');

export default api;

