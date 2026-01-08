import { apiClient } from './apiClient';
import { User, Account } from '@/types';

export const userService = {
  async getUserInfo(userId: number): Promise<User> {
    return apiClient.get<User>(`/api/users/${userId}`);
  },

  async getAccountInfo(accountId: number): Promise<Account> {
    return apiClient.get<Account>(`/api/account/${accountId}`);
  },

  async updateUserInfo(userId: number, data: Partial<User>): Promise<User> {
    return apiClient.patch<User>(`/api/users/${userId}`, data);
  },

  async updateAccountAlias(accountId: number, alias: string): Promise<Account> {
    return apiClient.patch<Account>(`/api/account/${accountId}`, { alias });
  },
};
