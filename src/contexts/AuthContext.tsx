"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { authClient } from "@/lib/client-auth";

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
  signOut: () => Promise<void>;
  upgrade: (plan: 'basic' | 'premium') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    plan: (session.user as { plan?: 'free' | 'basic' | 'premium' }).plan || 'free'
  } : null;

  const signUp = async (email: string, password: string) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split('@')[0], // Default name from email
    });
    if (error) throw new Error(error.message || "Failed to sign up");
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) throw new Error(error.message || "Invalid email or password");
  };

  const signOut = async () => {
    await authClient.signOut();
  };

  const upgrade = async (plan: 'basic' | 'premium') => {
    // In a real app, this would be handled by Stripe webhooks or an API call.
    // For now, we might need an API route to update the user's plan.
    console.log(`Upgrading to ${plan}`);
    // implementation for simulation or actual update
  };

  const value = {
    user,
    isLoggedIn: !!session,
    isPremium: user?.plan === 'premium',
    isBasic: user?.plan === 'basic' || user?.plan === 'premium',
    signUp,
    signIn,
    signOut,
    upgrade
  };

  if (isPending && !session) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading session...</div>;
  }

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
