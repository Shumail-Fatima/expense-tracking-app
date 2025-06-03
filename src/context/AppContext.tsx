import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, AppState, TransactionType } from '../types';

// Initial default categories
export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#F59E0B' },
  { id: 'shopping', name: 'Shopping', color: '#EC4899' },
  { id: 'transportation', name: 'Transportation', color: '#3B82F6' },
  { id: 'entertainment', name: 'Entertainment', color: '#8B5CF6' },
  { id: 'utilities', name: 'Utilities', color: '#10B981' },
  { id: 'other', name: 'Other', color: '#6B7280' },
  { id: 'salary', name: 'Salary', color: '#10B981' },
  { id: 'gift', name: 'Gift', color: '#F472B6' },
];

// Define action types
type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'EDIT_TRANSACTION'; payload: Transaction }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_WALLET_AMOUNT'; payload: number }
  | { type: 'TOP_UP_EXPENSE'; payload: string };

// Initial state
const initialState: AppState = {
  transactions: [],
  balance: 0,
  walletAmount: 0,
};

// Calculate balance from transactions
const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      return acc + transaction.amount;
    } else {
      return acc - transaction.amount;
    }
  }, 0);
};

// Reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const updatedTransactions = [...state.transactions, action.payload];
      const newBalance = calculateBalance(updatedTransactions);
      return {
        ...state,
        transactions: updatedTransactions,
        balance: newBalance,
        walletAmount: action.payload.type === 'expense' 
          ? state.walletAmount - action.payload.amount 
          : state.walletAmount + action.payload.amount,
      };
    }
    
    case 'DELETE_TRANSACTION': {
      const transaction = state.transactions.find(t => t.id === action.payload);
      const filteredTransactions = state.transactions.filter(t => t.id !== action.payload);
      const newBalance = calculateBalance(filteredTransactions);
      
      return {
        ...state,
        transactions: filteredTransactions,
        balance: newBalance,
        walletAmount: transaction?.type === 'expense'
          ? state.walletAmount + (transaction?.amount || 0)
          : state.walletAmount - (transaction?.amount || 0),
      };
    }
    
    case 'EDIT_TRANSACTION': {
      const oldTransaction = state.transactions.find(t => t.id === action.payload.id);
      const editedTransactions = state.transactions.map(transaction => 
        transaction.id === action.payload.id ? action.payload : transaction
      );
      const newBalance = calculateBalance(editedTransactions);
      
      let newWalletAmount = state.walletAmount;
      if (oldTransaction) {
        // Reverse the old transaction's effect
        if (oldTransaction.type === 'expense') {
          newWalletAmount += oldTransaction.amount;
        } else {
          newWalletAmount -= oldTransaction.amount;
        }
        // Apply the new transaction's effect
        if (action.payload.type === 'expense') {
          newWalletAmount -= action.payload.amount;
        } else {
          newWalletAmount += action.payload.amount;
        }
      }

      return {
        ...state,
        transactions: editedTransactions,
        balance: newBalance,
        walletAmount: newWalletAmount,
      };
    }
    
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        balance: calculateBalance(action.payload),
      };

    case 'SET_WALLET_AMOUNT':
      return {
        ...state,
        walletAmount: action.payload,
      };
    
    case 'TOP_UP_EXPENSE': {
      const transaction = state.transactions.find(t => t.id === action.payload);
      if (transaction && transaction.type === 'expense') {
        const updatedTransactions = state.transactions.filter(t => t.id !== action.payload);
        return {
          ...state,
          transactions: updatedTransactions,
          balance: calculateBalance(updatedTransactions),
          walletAmount: state.walletAmount + transaction.amount,
        };
      }
      return state;
    }
    
    default:
      return state;
  }
};

// Create context
interface AppContextProps {
  state: AppState;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (transaction: Transaction) => void;
  setWalletAmount: (amount: number) => void;
  topUpExpense: (id: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      const savedWalletAmount = localStorage.getItem('walletAmount');
      
      if (savedTransactions && savedTransactions !== 'undefined') {
        const parsedTransactions = JSON.parse(savedTransactions);
        if (Array.isArray(parsedTransactions)) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: parsedTransactions });
        }
      }

      if (savedWalletAmount && savedWalletAmount !== 'undefined') {
        const parsedWalletAmount = JSON.parse(savedWalletAmount);
        if (typeof parsedWalletAmount === 'number' && !isNaN(parsedWalletAmount)) {
          dispatch({ type: 'SET_WALLET_AMOUNT', payload: parsedWalletAmount });
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // If there's an error, we'll use the initial state
    }
  }, []);

  // Save to localStorage whenever transactions or wallet amount change
  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
      localStorage.setItem('walletAmount', JSON.stringify(state.walletAmount));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state.transactions, state.walletAmount]);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  // Edit a transaction
  const editTransaction = (transaction: Transaction) => {
    dispatch({ type: 'EDIT_TRANSACTION', payload: transaction });
  };

  // Set wallet amount
  const setWalletAmount = (amount: number) => {
    dispatch({ type: 'SET_WALLET_AMOUNT', payload: amount });
  };

  // Top up expense (remove expense and add amount back to wallet)
  const topUpExpense = (id: string) => {
    dispatch({ type: 'TOP_UP_EXPENSE', payload: id });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      addTransaction, 
      deleteTransaction, 
      editTransaction, 
      setWalletAmount,
      topUpExpense 
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};