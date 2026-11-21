'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IManagerUser } from '@/types';

interface ManagerAuthContextType {
  user: IManagerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  demoLogin: () => void;
  logout: () => void;
}

const defaultManager: IManagerUser = {
  id: 'usr-mgr-1',
  cafe_id: 'cafe001',
  name: 'Store Manager',
  email: 'manager@shawarmapalace.com',
  role: 'manager',
  token: 'mock-jwt-token-cafe001',
};

const ManagerAuthContext = createContext<ManagerAuthContextType | undefined>(undefined);

export function ManagerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IManagerUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('cafe_manager_session');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    // PIN authentication
    if (pin === '1234' || pin === 'admin123' || (email && pin.length >= 4)) {
      const authUser: IManagerUser = {
        ...defaultManager,
        email: email || defaultManager.email,
        name: email.split('@')[0].toUpperCase() || 'Manager',
      };
      setUser(authUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cafe_manager_session', JSON.stringify(authUser));
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid PIN or credentials. Try PIN: 1234' };
  };

  const demoLogin = () => {
    setUser(defaultManager);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cafe_manager_session', JSON.stringify(defaultManager));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cafe_manager_session');
    }
  };

  return (
    <ManagerAuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        demoLogin,
        logout,
      }}
    >
      {children}
    </ManagerAuthContext.Provider>
  );
}

export function useManagerAuth() {
  const context = useContext(ManagerAuthContext);
  if (!context) {
    throw new Error('useManagerAuth must be used within a ManagerAuthProvider');
  }
  return context;
}
