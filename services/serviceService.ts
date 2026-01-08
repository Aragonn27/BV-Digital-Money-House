import { apiClient } from './apiClient';
import { Service, PayServiceRequest, DepositRequest } from '@/types';

export const serviceService = {
  async getServices(): Promise<Service[]> {
    return apiClient.get<Service[]>('/api/service');
  },

  async getServiceById(serviceId: number): Promise<Service> {
    return apiClient.get<Service>(`/api/service/${serviceId}`);
  },

  async payService(accountId: number, payment: PayServiceRequest): Promise<void> {
    return apiClient.post<void>(`/api/accounts/${accountId}/transferences`, payment);
  },

  async deposit(accountId: number, deposit: DepositRequest): Promise<void> {
    return apiClient.post<void>(`/api/accounts/${accountId}/deposits`, deposit);
  },
};
