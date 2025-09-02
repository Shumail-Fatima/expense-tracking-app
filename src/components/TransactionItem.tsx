import React, { useState } from 'react';
import { Transaction } from '../types';
import { useAppContext } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../constants/Categories';
import { Trash2, Edit, X, Check } from 'lucide-react';
import { format } from '../utils/dateFormatter';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { deleteTransaction, editTransaction } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(transaction.description);
  const [editedAmount, setEditedAmount] = useState(transaction.amount.toString());
  const [editedCategory, setEditedCategory] = useState(transaction.category);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const category = DEFAULT_CATEGORIES.find(c => c.id === transaction.category) || DEFAULT_CATEGORIES[5]; // Default to "Other"

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const amount = parseFloat(editedAmount);
    if (isNaN(amount) || amount <= 0) return;

    editTransaction({
      ...transaction,
      description: editedDescription,
      amount,
      category: editedCategory
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(transaction.description);
    setEditedAmount(transaction.amount.toString());
    setEditedCategory(transaction.category);
    setIsEditing(false);
  };

  return (
    <div className={`
      border-l-4 mb-3 bg-white rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-200
      ${transaction.type === 'income' ? 'border-green-500' : 'border-red-400'}
    `}>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex space-x-2">
              <input
                type="number"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.01"
                step="0.01"
              />

              <select
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DEFAULT_CATEGORIES
                  .filter(cat =>
                    transaction.type === 'expense'
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

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-blue-500 hover:text-blue-700"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">{transaction.description}</h3>
                <div className="flex items-center mt-1">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span className="text-sm text-gray-500">{category.name}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{format(new Date(transaction.date))}</p>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-blue-600 p-1"
                    aria-label="Edit transaction"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            { showDeleteConfirm && (
              <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded">
                <p className="text-sm text-red-700 mb-2">Are you sure you want to delete this transaction?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
