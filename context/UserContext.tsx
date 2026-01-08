'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Account } from '@/types';

interface UserContextType {
  user: User | null;
  account: Account | null;
  setUser: (user: User | null) => void;
  setAccount: (account: Account | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage si existen
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedAccount = localStorage.getItem('account');
        
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedAccount) setAccount(JSON.parse(savedAccount));
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Guardar user en localStorage cuando cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Guardar account en localStorage cuando cambia
  useEffect(() => {
    if (account) {
      localStorage.setItem('account', JSON.stringify(account));
    } else {
      localStorage.removeItem('account');
    }
  }, [account]);

  return (
    <UserContext.Provider value={{ user, account, setUser, setAccount, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
