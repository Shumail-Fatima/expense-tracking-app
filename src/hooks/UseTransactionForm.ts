//import { useState } from 'react';
//import { useAppContext } from '../context/AppContext';
//import { TransactionType } from '../types';
//import { DEFAULT_CATEGORIES } from '../constants/categories';


/*
export const useTransactionForm = (onSuccess?: () => void) => {
    const { addTransaction } = useAppContext();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>('expense');
    const [category, setCategory] = useState('other');
    const [error, setError] = useState('');

    const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('other');
    setError('');
  };
    
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
    resetForm();
    if (onSuccess) onSuccess();

}   

    
  return {
    description,
    setDescription,
    amount,
    setAmount,
    type,
    setType,
    category,
    setCategory,
    error,
    handleSubmit,
    resetForm,
  };


};*/