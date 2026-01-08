'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { LoginRequest, RegisterRequest, User, Account } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Cargar token desde localStorage al iniciar
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      const newToken = response.token;
      
      // Guardar token inmediatamente
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      // Cargar datos de la cuenta después del login usando el token
      try {
        const account: Account = await authService.getAccount(newToken);
        localStorage.setItem('account', JSON.stringify(account));
        
        // Cargar datos del usuario usando el user_id de la cuenta
        if (account.user_id) {
          const user: User = await userService.getUserInfo(account.user_id, newToken);
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (userError) {
        console.error('Error al cargar datos del usuario:', userError);
        // No lanzar el error, permitir que el usuario acceda al dashboard
        // Los datos se cargarán desde UserContext
      }
      
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authService.register(data);
      // Después del registro exitoso, redirigir a login
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('account');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        register,
        logout,
        isLoading,
      }}
    >
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
