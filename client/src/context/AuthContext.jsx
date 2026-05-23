// Authentication context and helpers for FinTrack

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, loginUser, registerUser } from '../api/api';

const AuthContext = createContext(null);

const getStoredUser = () => {
  const stored = localStorage.getItem('user');
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();
        const data = response?.data ?? response;
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const tokenValue = response?.token ?? response?.data?.token;
      const userValue = response?.data?.user ?? response?.user ?? response?.data;

      if (tokenValue) {
        localStorage.setItem('token', tokenValue);
        setToken(tokenValue);
      }

      if (userValue) {
        localStorage.setItem('user', JSON.stringify(userValue));
        setUser(userValue);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await registerUser(name, email, password);
      const tokenValue = response?.token ?? response?.data?.token;
      const userValue = response?.data?.user ?? response?.user ?? response?.data;

      if (tokenValue) {
        localStorage.setItem('token', tokenValue);
        setToken(tokenValue);
      }

      if (userValue) {
        localStorage.setItem('user', JSON.stringify(userValue));
        setUser(userValue);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
