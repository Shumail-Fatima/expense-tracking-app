export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface AppState {
  transactions: Transaction[];
  balance: number;
  walletAmount: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}