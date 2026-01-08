import { apiClient } from './apiClient';
import { Card, AddCardRequest } from '@/types';

export const cardService = {
  async getCards(accountId: number): Promise<Card[]> {
    return apiClient.get<Card[]>(`/api/accounts/${accountId}/cards`);
  },

  async getCardById(accountId: number, cardId: number): Promise<Card> {
    return apiClient.get<Card>(`/api/accounts/${accountId}/cards/${cardId}`);
  },

  async addCard(accountId: number, cardData: AddCardRequest): Promise<Card> {
    return apiClient.post<Card>(`/api/accounts/${accountId}/cards`, cardData);
  },

  async deleteCard(accountId: number, cardId: number): Promise<void> {
    return apiClient.delete<void>(`/api/accounts/${accountId}/cards/${cardId}`);
  },
};
