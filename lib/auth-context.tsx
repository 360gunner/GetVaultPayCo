"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse } from './vaultpay-api';

interface AuthContextType {
  user: AuthResponse['data'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: AuthResponse['data']) => void;
  logout: () => void;
  updateUser: (userData: AuthResponse['data']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['data'] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('vaultpay_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('vaultpay_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: AuthResponse['data']) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('vaultpay_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vaultpay_user');
    localStorage.removeItem('signupCountry');
  };

  const updateUser = (userData: AuthResponse['data']) => {
    setUser(userData);
    localStorage.setItem('vaultpay_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}>
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
