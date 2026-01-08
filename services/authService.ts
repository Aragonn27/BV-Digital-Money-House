import { apiClient } from './apiClient';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/login', credentials);
  },

  async register(data: RegisterRequest): Promise<void> {
    return apiClient.post<void>('/api/users', data);
  },
};
