import { apiClient } from './apiClient';
import { User, Account } from '@/types';

export const userService = {
  async getUserInfo(userId: number, token?: string): Promise<User> {
    return apiClient.get<User>(`/api/users/${userId}`, token);
  },

  async getAccountInfo(accountId: number, token?: string): Promise<Account> {
    return apiClient.get<Account>(`/api/accounts/${accountId}`, token);
  },

  async updateUserInfo(userId: number, data: Partial<User>): Promise<User> {
    return apiClient.patch<User>(`/api/users/${userId}`, data);
  },

  async updateAccountAlias(accountId: number, alias: string): Promise<Account> {
    return apiClient.patch<Account>(`/api/accounts/${accountId}`, { alias });
  },
};
