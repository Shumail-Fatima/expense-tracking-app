import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import TransactionItem from './TransactionItem';
import { Search, Filter } from 'lucide-react';

const TransactionList: React.FC = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  const filteredTransactions = useMemo(() => {
    return state.transactions
      .filter(transaction => {
        // Filter by type
        if (filterType !== 'all' && transaction.type !== filterType) {
          return false;
        }
        
        // Filter by search term
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          return (
            transaction.description.toLowerCase().includes(term) || 
            transaction.category.toLowerCase().includes(term)
          );
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.transactions, searchTerm, filterType]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-24">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Transactions</h2>
      
      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              filterType === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              filterType === 'income' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('income')}
          >
            Income
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              filterType === 'expense' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('expense')}
          >
            Expenses
          </button>
        </div>
      </div>
      
      {/* Transactions List */}
      <div>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">
              {state.transactions.length === 0 
                ? "No transactions yet. Add your first one!" 
                : "No transactions match your filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;