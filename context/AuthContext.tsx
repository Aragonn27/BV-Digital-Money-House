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
      console.log('1. Iniciando login...');
      const response = await authService.login(credentials);
      const newToken = response.token;
      
      console.log('2. Token obtenido:', newToken ? 'SÍ (longitud: ' + newToken.length + ')' : 'NO');
      
      // Decodificar el token JWT para obtener el account_id
      const tokenParts = newToken.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const accountId = payload.account_id;
      
      console.log('3. Account ID extraído del token:', accountId);
      
      // Guardar token inmediatamente
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      // Esperar un momento para que se guarde
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verificar que se guardó
      const savedToken = localStorage.getItem('token');
      console.log('4. Token guardado en localStorage:', savedToken ? 'SÍ' : 'NO');
      
      // Cargar datos de la cuenta después del login usando el account_id del token
      try {
        console.log('5. Intentando cargar cuenta con ID:', accountId);
        const account: Account = await userService.getAccountInfo(accountId, newToken);
        console.log('6. Cuenta cargada exitosamente:', account);
        localStorage.setItem('account', JSON.stringify(account));
        
        // Cargar datos del usuario usando el user_id de la cuenta
        if (account.user_id) {
          console.log('7. Intentando cargar usuario con ID:', account.user_id);
          const user: User = await userService.getUserInfo(account.user_id, newToken);
          console.log('8. Usuario cargado exitosamente:', user);
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        console.log('9. Redirigiendo a dashboard...');
        router.push('/dashboard');
      } catch (userError: any) {
        console.error('ERROR DETALLADO:', {
          message: userError.message,
          statusCode: userError.statusCode,
          error: userError
        });
        
        // Mostrar mensaje específico según el error
        if (userError.statusCode === 401) {
          alert('Error de autenticación. El token no es válido. Por favor, intenta nuevamente.');
          // Limpiar todo y volver a login
          setToken(null);
          localStorage.clear();
          return;
        }
        
        alert('Error al cargar datos de la cuenta. Redirigiendo al dashboard...');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
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
