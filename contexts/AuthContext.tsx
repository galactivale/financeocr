'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, type User, type LoginRequest } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isManagingPartner: boolean;
  isTaxManager: boolean;
  isStaffAccountant: boolean;
  isSystemAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await apiClient.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isManagingPartner = user?.role === 'managing-partner';
  const isTaxManager = user?.role === 'tax-manager';
  const isStaffAccountant = user?.role === 'staff-accountant';
  const isSystemAdmin = user?.role === 'system-admin';

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isManagingPartner,
    isTaxManager,
    isStaffAccountant,
    isSystemAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
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


