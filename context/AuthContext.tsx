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
      const newToken = response.token.trim(); // Eliminar espacios en blanco
      
      console.log('2. Token obtenido:', newToken ? 'SÍ (longitud: ' + newToken.length + ')' : 'NO');
      console.log('2.1. Token completo:', newToken);
      console.log('2.2. Token tiene', newToken.split('.').length, 'segmentos (debe ser 3)');
      
      // Decodificar y mostrar el payload del token
      try {
        const tokenParts = newToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('2.2. Payload del token:', payload);
      } catch (e) {
        console.error('Error decodificando token:', e);
      }
      
      // Guardar token inmediatamente en localStorage Y cookies
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      // Guardar en cookies para que el middleware pueda acceder
      document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 año
      
      // Esperar un momento para que el token se "active" en el servidor
      console.log('3. Esperando 2 segundos para que el token se active...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar que se guardó
      const savedToken = localStorage.getItem('token');
      console.log('3.1. Token guardado en localStorage:', savedToken ? 'SÍ' : 'NO');
      console.log('3.2. Token guardado en cookies:', document.cookie.includes('token=') ? 'SÍ' : 'NO');
      
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
        // Usar window.location.href para forzar navegación completa
        window.location.href = '/dashboard';
      } catch (userError: any) {
        console.error('ERROR DETALLADO:', {
          message: userError.message,
          statusCode: userError.statusCode,
          error: userError
        });
        
        // Si hay error cargando datos adicionales, continuar al dashboard igual
        // El token YA está guardado y es válido
        console.log('Advertencia: Error cargando datos adicionales, pero token guardado. Continuando...');
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
    // Borrar cookie
    document.cookie = 'token=; path=/; max-age=0';
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
