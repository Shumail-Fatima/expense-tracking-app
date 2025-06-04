import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import TransactionItem from '../TransactionItem';
//import { Search, Filter } from 'lucide-react';
import { Filter } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../context/Categories';
//import AddTransaction from './AddTransaction';
//import { DEFAULT_CATEGORIES } from '../constants/categories';


const TransactionList: React.FC = () => {
  const { state } = useAppContext();
  //const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return state.transactions
      .filter(transaction => {
        // Filter by type
        if (filterType !== 'all' && transaction.type !== filterType) {
          return false;
        }

        // Filter by category
        if (filterCategory !== 'all' && transaction.category !== filterCategory) {
          return false;
        }
      
        if (startTime && new Date(transaction.date).getTime()  < new Date(startTime).getTime() ){
          return false;
        }

        if (endTime && new Date(transaction.date).getTime() > new Date(endTime).getTime()) {
          return false;
        }

        /*
        // Filter by search term not being used now
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          return (
            transaction.description.toLowerCase().includes(term) || 
            transaction.category.toLowerCase().includes(term)
          );
        }*/
        
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.transactions, filterType, filterCategory, startTime, endTime]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-24">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Transactions</h2>
      
      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        {/*
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
        </div>*/}
        
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
        

        {/*
        <div className="flex flex-wrap space-x-2 mt-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              filterCategory === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterCategory('all')}
          >
            All Categories
          </button>
          {DEFAULT_CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`px-3 py-1 rounded-md text-sm ${
                filterCategory === category.id
                  ? `bg-[${category.color}] text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilterCategory(category.id)}
              style={{ backgroundColor: filterCategory === category.id ? category.color : undefined }}
            >
              {category.name}
            </button>
          ))}
        </div>*/}
        
        
        <div className="mt-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {DEFAULT_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-4 mt-2">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
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