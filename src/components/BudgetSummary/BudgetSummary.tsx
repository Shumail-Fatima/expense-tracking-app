import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
//import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import SummaryDisplay from './SummaryDisplay';
import IncomeExpenseCard from './IncomeExpenseCard';

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

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Budget Summary</h2>
      <SummaryDisplay balance={summary.balance} totalIncome={summary.totalIncome} totalExpenses={summary.totalExpenses} />
    
    <div className="grid grid-cols-2 gap-4">
        <IncomeExpenseCard 
        icon={<ArrowUpCircle className="h-5 w-5 mr-2" />} 
        title={'income'} 
        amount={summary.totalIncome} 
        bgColor={'green'}>
        </IncomeExpenseCard>
        
        <IncomeExpenseCard 
        icon={<ArrowDownCircle className="h-5 w-5 mr-2" />} 
        title={'expense'} 
        amount={summary.totalExpenses} 
        bgColor={'red'}>
        </IncomeExpenseCard>
    </div>
      
    </div>
  );
};

export default BudgetSummary;