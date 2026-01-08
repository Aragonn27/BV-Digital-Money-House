import { apiClient } from './apiClient';
import { Card, AddCardRequest } from '@/types';

export const cardService = {
  async getCards(accountId: number): Promise<Card[]> {
    return apiClient.get<Card[]>(`/api/account/${accountId}/cards`);
  },

  async getCardById(accountId: number, cardId: number): Promise<Card> {
    return apiClient.get<Card>(`/api/account/${accountId}/cards/${cardId}`);
  },

  async addCard(accountId: number, cardData: AddCardRequest): Promise<Card> {
    return apiClient.post<Card>(`/api/account/${accountId}/cards`, cardData);
  },

  async deleteCard(accountId: number, cardId: number): Promise<void> {
    return apiClient.delete<void>(`/api/account/${accountId}/cards/${cardId}`);
  },
};
