import { apiClient } from './apiClient';
import { Transaction, TransactionFilter } from '@/types';

export const transactionService = {
  async getTransactions(
    accountId: number,
    filters?: TransactionFilter
  ): Promise<Transaction[]> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/api/account/${accountId}/transactions${
      queryString ? `?${queryString}` : ''
    }`;

    return apiClient.get<Transaction[]>(endpoint);
  },

  async getTransactionById(
    accountId: number,
    transactionId: number
  ): Promise<Transaction> {
    return apiClient.get<Transaction>(
      `/api/account/${accountId}/transactions/${transactionId}`
    );
  },
};
