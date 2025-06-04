import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
//import { Transaction, AppState, TransactionType } from '../types';
import { Transaction, AppState} from '../types';
import { appReducer } from './AppReducer';
import { initialState } from '../constants/InitialState';
import { loadFromStorage, saveToStorage } from '../utils/storage';

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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedTransactions = loadFromStorage<Transaction[]>('transactions');
    const savedWalletAmount = loadFromStorage<number>('walletAmount');
    if (savedTransactions) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: savedTransactions });
    }
    if (typeof savedWalletAmount === 'number') {
      dispatch({ type: 'SET_WALLET_AMOUNT', payload: savedWalletAmount });
    }
  }, []);

  useEffect(() => {
    saveToStorage('transactions', state.transactions);
    saveToStorage('walletAmount', state.walletAmount);
  }, [state.transactions, state.walletAmount]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...transaction, id: crypto.randomUUID() };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const editTransaction = (transaction: Transaction) => {
    dispatch({ type: 'EDIT_TRANSACTION', payload: transaction });
  };

  const setWalletAmount = (amount: number) => {
    dispatch({ type: 'SET_WALLET_AMOUNT', payload: amount });
  };

  const topUpExpense = (id: string) => {
    dispatch({ type: 'TOP_UP_EXPENSE', payload: id });
  };

  return (
    <AppContext.Provider value={{ state, addTransaction, deleteTransaction, editTransaction, setWalletAmount, topUpExpense }}>
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