import { useMemo } from "react";
import { Transaction } from "../../../types";

const useFilteredTransactions = (
    transactions: Transaction[],
    filterType: 'all' | 'income' | 'expense',
    filterCategory: string,
    startTime: string,
    endTime: string
) => {
    return useMemo(() => {
        return transactions
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
      }, [transactions, filterType, filterCategory, startTime, endTime]);
};

export default useFilteredTransactions;