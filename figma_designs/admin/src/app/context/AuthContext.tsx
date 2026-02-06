import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockAdmin } from '../mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  admin: typeof mockAdmin | null;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<typeof mockAdmin | null>(null);

  const login = async (phone: string, otp: string): Promise<boolean> => {
    // Mock authentication - accept phone: +1234567800 and otp: 123456
    if (phone === '+1234567800' && otp === '123456') {
      setIsAuthenticated(true);
      setAdmin(mockAdmin);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
