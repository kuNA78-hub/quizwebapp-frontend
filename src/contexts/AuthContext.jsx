import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';
import { storage } from '../utils/storage';
import { getErrorMessage } from '../utils/errorHandler';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = storage.getToken();
    const savedUser = storage.getUser();
    if (token && savedUser) {
      if (savedUser.role) savedUser.role = savedUser.role.toLowerCase();
      setUser(savedUser);
      setIsAuthenticated(true);
      apiService.users.getProfile().catch(() => logout());
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const res = await apiService.users.register(userData);
      const { token, user: userInfo } = res.data.data;
      if (userInfo.role) userInfo.role = userInfo.role.toLowerCase();
      storage.setToken(token);
      storage.setUser(userInfo);
      setUser(userInfo);
      setIsAuthenticated(true);
      toast.success('Registration successful');
      return { success: true };
    } catch (err) {
      toast.error(getErrorMessage(err));
      return { success: false };
    }
  };

  const login = async (credentials) => {
    try {
      const res = await apiService.users.login(credentials);
      const { token, user: userInfo } = res.data.data;
      if (userInfo.role) userInfo.role = userInfo.role.toLowerCase();
      storage.setToken(token);
      storage.setUser(userInfo);
      setUser(userInfo);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${userInfo.username}`);
      return { success: true };
    } catch (err) {
      toast.error(getErrorMessage(err));
      return { success: false };
    }
  };

  const logout = () => {
    storage.clear();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out');
  };

  const value = { user, loading, isAuthenticated, register, login, logout };
  return React.createElement(AuthContext.Provider, { value }, children);
};

export default AuthProvider;
