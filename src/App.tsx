import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import BudgetSummary from './components/BudgetSummary/BudgetSummary';
import TransactionList from './components/Transaction list/TransactionList';
import AddTransaction from './components/Add transaction/AddTransaction';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-3xl">
          <BudgetSummary />
          <TransactionList />
          <AddTransaction />
        </main>
      </div>
    </AppProvider>
  );
}

export default App;