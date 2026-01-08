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
      
      // Guardar token inmediatamente
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      // Esperar un momento para que se guarde
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verificar que se guardó
      const savedToken = localStorage.getItem('token');
      console.log('3. Token guardado en localStorage:', savedToken ? 'SÍ' : 'NO');
      
      // Extraer user_id del token JWT
      try {
        const tokenParts = newToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = parseInt(payload.username); // El user_id está en el campo "username"
        
        console.log('4. User ID extraído del token:', userId);
        
        // Cargar datos del usuario primero
        console.log('5. Intentando cargar usuario con ID:', userId);
        const user: User = await userService.getUserInfo(userId, newToken);
        console.log('6. Usuario cargado exitosamente:', user);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Ahora cargar la cuenta del usuario
        // Primero intentamos con el endpoint /api/account
        console.log('7. Intentando cargar cuenta...');
        try {
          const account: Account = await authService.getAccount(newToken);
          console.log('8. Cuenta cargada exitosamente:', account);
          localStorage.setItem('account', JSON.stringify(account));
        } catch (accountError: any) {
          // Si falla /api/account, podemos redirigir igual
          // El UserContext cargará la cuenta en el dashboard
          console.log('Advertencia: No se pudo cargar la cuenta, continuando...');
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
