import { useState, useEffect } from 'react';

export function useTransactionData(transactions) {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netAmount: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    if (!transactions.length) return;

    // Calculate summary
    const currentSummary = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          acc.totalIncome += amount;
        } else {
          acc.totalExpenses += amount;
        }
        acc.netAmount = acc.totalIncome - acc.totalExpenses;
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, netAmount: 0 }
    );

    // Calculate monthly data
    const monthlyTransactions = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += Number(transaction.amount);
      } else {
        acc[month].expense += Number(transaction.amount);
      }
      
      return acc;
    }, {});

    // Calculate category distribution (only for expenses)
    const categoryTransactions = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category;
        const amount = Number(transaction.amount);
        
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
      }, {});

    setMonthlyData(Object.entries(monthlyTransactions).map(([month, data]) => ({
      month,
      ...data
    })));

    setCategoryData(Object.entries(categoryTransactions).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    })));

    setSummary(currentSummary);
  }, [transactions]);

  return { summary, monthlyData, categoryData };
} 