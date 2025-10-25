import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAnalytics = () => API.get('/analytics');
export const getTables = () => API.get('/tables');
export const getOrders = () => API.get('/orders');
export const getChefs = () => API.get('/chefs');

export default API;
