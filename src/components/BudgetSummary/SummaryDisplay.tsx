import React from "react";

interface SummaryDisplayProps{
    balance: number;
    totalIncome: number;
    totalExpenses: number;
}

const SummaryDisplay : React.FC<SummaryDisplayProps> = ({balance, totalIncome, totalExpenses}) => {
    const isOverBudget = balance < 0;
      // Calculate percentage for progress bar
  const calculatePercentage = () => {
    if (totalIncome <= 0) return 0;
    const spentPercentage = (totalExpenses / totalIncome) * 100;
    return Math.min(spentPercentage, 100); // Cap at 100%
  };

  const percentage = calculatePercentage();

  return(
    <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600">Current Balance</p>
          <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-500' : 'text-blue-600'}`}>
            ${Math.abs(balance).toFixed(2)}
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
  )

}

export default SummaryDisplay;