"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  plan: 'free' | 'basic' | 'premium';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  upgrade: (plan: 'basic' | 'premium') => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem('qr_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    // Simple mock signup - in production use Better Auth
    const newUser: User = {
      id: Date.now().toString(),
      email,
      plan: 'free'
    };
    localStorage.setItem('qr_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    // Simple mock signin - in production use Better Auth
    const stored = localStorage.getItem('qr_user');
    if (stored) {
      const existingUser = JSON.parse(stored);
      if (existingUser.email === email) {
        setUser(existingUser);
        return;
      }
    }
    // If no existing user, create one
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

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, upgrade }}>
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
