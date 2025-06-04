//import React, { useState } from 'react';
import React from 'react';
//import { useAppContext } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../constants/Categories';
import { Plus, X } from 'lucide-react';
//import { TransactionType } from '../types';
//import { DEFAULT_CATEGORIES } from '../constants/categories';
import { useTransactionForm } from '../hooks/UseTransactionForm';



const AddTransaction: React.FC = () => {

  const {
    isFormOpen,
    openForm,
    closeForm,
    description,
    amount,
    type,
    category,
    error,
    date,
    setDate,
    handleSubmit,
    setDescription,
    setAmount,
    setType,
    setCategory,
  } = useTransactionForm();
/*

  const { addTransaction } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('other');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Add transaction
    addTransaction({
      description: description.trim(),
      amount: amountValue,
      type,
      category,
      date: new Date().toISOString(),
    });
    
    // Reset form
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('other');
    setError('');
    setIsFormOpen(false);
  };
  */

  if (!isFormOpen) {
    return (
      <button
        onClick={() => openForm()}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
        //className="fixed bottom 50 center-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
        //className="fixed binset[3px] top [6] center-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
        //className="bg-blue-600 text-white rounded-md px-4 py-2 shadow hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
        aria-label="Add transaction"
      >
        <Plus className="h-6 w-6" />
        <span></span>
      </button>
    );
  }

  /*if (!isFormOpen) {
    return (
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm hover:bg-blue-700 transition whitespace-nowrap"
      >
        + Add Transaction
      </button>
    );
  }*/




  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>
          <button 
            onClick={() => closeForm()}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Transaction Type Toggle */}
          <div className="mb-4">
            <div className="flex rounded-md overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2 px-4 ${
                  type === 'expense' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 ${
                  type === 'income' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setType('income')}
              >
                Income
              </button>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What was this transaction for?"
            />
          </div>
          
          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          
          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DEFAULT_CATEGORIES
                .filter(cat => 
                  type === 'expense' 
                    ? cat.id !== 'salary' && cat.id !== 'gift'
                    : cat.id === 'salary' || cat.id === 'gift' || cat.id === 'other'
                )
                .map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              }
            </select>
          </div>

          {/* date */}
          <div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;