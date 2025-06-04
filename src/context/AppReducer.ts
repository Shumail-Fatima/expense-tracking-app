import { Transaction, AppState} from '../types';

// Define action types
type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'EDIT_TRANSACTION'; payload: Transaction }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_WALLET_AMOUNT'; payload: number }
  | { type: 'TOP_UP_EXPENSE'; payload: string };

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
export const appReducer = (state: AppState, action: Action): AppState => {
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

//export {Action};
