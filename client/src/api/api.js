// Centralized API client and endpoints for FinTrack

import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

const unwrap = (response) => response?.data ?? response;

// Auth
export const registerUser = async (name, email, password) => {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

// Transactions
export const getTransactions = async (params = {}) => {
  try {
    const response = await apiClient.get('/transactions', { params });
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const createTransaction = async (data) => {
  try {
    const response = await apiClient.post('/transactions', data);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await apiClient.put(`/transactions/${id}`, data);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await apiClient.delete(`/transactions/${id}`);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

// Budgets
export const getBudgets = async (month, year) => {
  try {
    const response = await apiClient.get('/budgets', { params: { month, year } });
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const createBudget = async (data) => {
  try {
    const response = await apiClient.post('/budgets', data);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await apiClient.delete(`/budgets/${id}`);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

// Debts
export const getDebts = async () => {
  try {
    const response = await apiClient.get('/debts');
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const createDebt = async (data) => {
  try {
    const response = await apiClient.post('/debts', data);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const updateDebt = async (id, data) => {
  try {
    const response = await apiClient.put(`/debts/${id}`, data);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const deleteDebt = async (id) => {
  try {
    const response = await apiClient.delete(`/debts/${id}`);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

// Reminders
export const getReminders = async () => {
  try {
    const response = await apiClient.get('/reminders');
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const createReminder = async (data) => {
  try {
    const response = await apiClient.post('/reminders', data);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const updateReminder = async (id, data) => {
  try {
    const response = await apiClient.put(`/reminders/${id}`, data);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const deleteReminder = async (id) => {
  try {
    const response = await apiClient.delete(`/reminders/${id}`);
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

// Summary
export const getMonthlySummary = async (month, year) => {
  try {
    const response = await apiClient.get('/summary/monthly', { params: { month, year } });
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const getCategorySummary = async (month, year) => {
  try {
    const response = await apiClient.get('/summary/categories', { params: { month, year } });
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};

export const getOverview = async () => {
  try {
    const response = await apiClient.get('/summary/overview');
    return unwrap(response);
  } catch (error) {
    throw error;
  }
};
