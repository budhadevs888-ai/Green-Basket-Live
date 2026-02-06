import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gb_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch {
        localStorage.removeItem('gb_token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = useCallback(async (phone, otp, role) => {
    const res = await api.post('/api/auth/verify-otp', { phone, otp, role });
    const { token: newToken, user: userData, redirect } = res.data;
    localStorage.setItem('gb_token', newToken);
    localStorage.setItem('gb_user', JSON.stringify(userData));
    setToken(newToken);
    setUser({ ...userData, user_id: userData.id });
    return { redirect, user: userData };
  }, []);

  const sendOtp = useCallback(async (phone) => {
    const res = await api.post('/api/auth/send-otp', { phone });
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('gb_token');
    localStorage.removeItem('gb_user');
    setToken(null);
    setUser(null);
  }, []);

  const getStoredUser = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('gb_user'));
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, sendOtp, logout, getStoredUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
