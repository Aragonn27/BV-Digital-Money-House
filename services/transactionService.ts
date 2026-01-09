import { apiClient } from './apiClient';
import { Transaction, TransactionFilter, DepositRequest } from '@/types';

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
    const endpoint = `/api/accounts/${accountId}/activity${
      queryString ? `?${queryString}` : ''
    }`;

    return apiClient.get<Transaction[]>(endpoint);
  },

  async getTransactionById(
    accountId: number,
    transactionId: number
  ): Promise<Transaction> {
    return apiClient.get<Transaction>(
      `/api/accounts/${accountId}/transactions/${transactionId}`
    );
  },

  async createDeposit(
    accountId: number,
    depositData: DepositRequest
  ): Promise<Transaction> {
    return apiClient.post<Transaction>(
      `/api/accounts/${accountId}/deposits`,
      depositData
    );
  },
};
