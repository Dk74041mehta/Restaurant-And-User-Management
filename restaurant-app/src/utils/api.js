import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Analytics
export const getAnalytics = async () => {
  const response = await apiClient.get('/analytics');
  return response.data;
};

export const getFilteredAnalytics = async (type) => {
  const response = await apiClient.get(`/analytics/filter?type=${type}`);
  return response.data;
};

// Orders
export const getOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.patch(`/orders/${id}`, { status });
  return response.data;
};

// Tables
export const getTables = async () => {
  const response = await apiClient.get('/tables');
  return response.data;
};

export const createTable = async (tableData) => {
  const response = await apiClient.post('/tables', tableData);
  return response.data;
};

export const deleteTable = async (id) => {
  const response = await apiClient.delete(`/tables/${id}`);
  return response.data;
};

export const updateTableStatus = async (id, status) => {
  const response = await apiClient.patch(`/tables/${id}`, { status });
  return response.data;
};

// Menu
export const getMenu = async () => {
  const response = await apiClient.get('/menu');
  return response.data;
};

export const createMenuItem = async (itemData) => {
  const response = await apiClient.post('/menu', itemData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await apiClient.delete(`/menu/${id}`);
  return response.data;
};

// Chefs
export const getChefs = async () => {
  const response = await apiClient.get('/chefs');
  return response.data;
};

// Clients
export const getClients = async () => {
  const response = await apiClient.get('/clients');
  return response.data;
};
