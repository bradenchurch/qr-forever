"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  plan: 'free' | 'basic' | 'premium';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isPremium: boolean;
  isBasic: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  upgrade: (plan: 'basic' | 'premium') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('qr_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      plan: 'free'
    };
    localStorage.setItem('qr_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    const stored = localStorage.getItem('qr_user');
    if (stored) {
      const existingUser = JSON.parse(stored);
      if (existingUser.email === email) {
        setUser(existingUser);
        return;
      }
    }
    const newUser: User = {
      id: Date.now().toString(),
      email,
      plan: 'free'
    };
    localStorage.setItem('qr_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signOut = () => {
    localStorage.removeItem('qr_user');
    setUser(null);
  };

  const upgrade = (plan: 'basic' | 'premium') => {
    if (user) {
      const updatedUser = { ...user, plan };
      localStorage.setItem('qr_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isPremium: user?.plan === 'premium',
    isBasic: user?.plan === 'basic' || user?.plan === 'premium',
    signUp,
    signIn,
    signOut,
    upgrade
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
