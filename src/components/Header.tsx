import React from 'react';
import { Wallet } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { state } = useAppContext();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wallet className="h-8 w-8" />
          <h1 className="text-2xl font-bold">BudgetTracker</h1>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold">Wallet: ${state.walletAmount.toFixed(2)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
