import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
//import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';


const BudgetSummary: React.FC = () => {
  const { state } = useAppContext();
  
  const summary = useMemo(() => {
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      balance: state.balance
    };
  }, [state.transactions, state.balance]);

  // Calculate percentage for progress bar
  const calculatePercentage = () => {
    if (summary.totalIncome <= 0) return 0;
    const spentPercentage = (summary.totalExpenses / summary.totalIncome) * 100;
    return Math.min(spentPercentage, 100); // Cap at 100%
  };

  const percentage = calculatePercentage();
  const isOverBudget = summary.balance < 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Budget Summary</h2>
      
      {/* Current Balance */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600">Current Balance</p>
          <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-500' : 'text-blue-600'}`}>
            ${Math.abs(summary.balance).toFixed(2)}
            <span className="text-sm ml-1">{isOverBudget ? 'overdrawn' : ''}</span>
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
          <div 
            className={`h-full transition-all duration-500 ease-out ${
              percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {percentage > 90 
            ? 'Warning: You\'ve used almost all your income!' 
            : percentage > 70 
              ? 'Caution: You\'re spending quickly' 
              : 'Good job managing your budget'}
        </p>
      </div>
      
      {/* Income and Expenses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center text-green-600 mb-2">
            <ArrowUpCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Income</h3>
          </div>
          <p className="text-xl font-semibold text-green-700">${summary.totalIncome.toFixed(2)}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center text-red-600 mb-2">
            <ArrowDownCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Expenses</h3>
          </div>
          <p className="text-xl font-semibold text-red-700">${summary.totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;