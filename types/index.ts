// User types
export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  dni: number;
  phone: string;
}

export interface Account {
  id: number;
  user_id: number;
  cvu: string;
  alias: string;
  available_amount: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dni: number;
  phone: string;
}

export interface AuthResponse {
  token: string;
}

// Card types
export interface Card {
  id: number;
  account_id: number;
  number_id: number;
  cod: number;
  expiration_date: string;
  first_last_name: string;
}

export interface AddCardRequest {
  cod: number;
  expiration_date: string;
  first_last_name: string;
  number_id: number;
}

// Transaction types
export interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  dated: string;
  description: string;
  destination: string;
  origin: string;
  type: 'deposit' | 'payment' | 'transfer';
}

export interface TransactionFilter {
  search?: string;
  page?: number;
  limit?: number;
}

// Service types
export interface Service {
  id: number;
  name: string;
  date: string;
  invoice_value: number;
}

export interface PayServiceRequest {
  amount: number;
  dated: string;
  destination: string;
  origin: string;
}

// Deposit types
export interface DepositRequest {
  amount: number;
  dated: string;
  destination: string;
  origin: string;
}

// API Error type
export interface ApiError {
  message: string;
  statusCode: number;
}
