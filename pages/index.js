import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Dashboard from "../components/Dashboard";
import BudgetForm from "../components/BudgetForm";
import BudgetOverview from "../components/BudgetOverview";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Set these as refs since they won't change during component lifecycle
  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const currentYear = new Date().getFullYear();
  const [editingBudget, setEditingBudget] = useState(null);

  // Combine fetch functions
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch transactions
      console.log('Fetching transactions...');
      const transactionsResponse = await fetch("/api/transactions");
      console.log('Transactions response status:', transactionsResponse.status);
      
      let transactionsData;
      try {
        transactionsData = await transactionsResponse.json();
        console.log('Transactions data:', transactionsData);
      } catch (parseError) {
        console.error('Error parsing transactions response:', parseError);
        throw new Error('Failed to parse transactions response');
      }
      
      if (!transactionsResponse.ok || !transactionsData.success) {
        throw new Error(transactionsData.message || `Failed to fetch transactions: ${transactionsResponse.status}`);
      }
      setTransactions(transactionsData.data);

      // Fetch budgets
      console.log('Fetching budgets...');
      const budgetsResponse = await fetch(
        `/api/budgets?month=${currentMonth}&year=${currentYear}`
      );
      console.log('Budgets response status:', budgetsResponse.status);
      
      let budgetsData;
      try {
        budgetsData = await budgetsResponse.json();
        console.log('Budgets data:', budgetsData);
      } catch (parseError) {
        console.error('Error parsing budgets response:', parseError);
        throw new Error('Failed to parse budgets response');
      }
      
      if (!budgetsResponse.ok || !budgetsData.success) {
        throw new Error(budgetsData.message || `Failed to fetch budgets: ${budgetsResponse.status}`);
      }
      setBudgets(budgetsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "An unexpected error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // Single useEffect for data fetching
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array since we're using current month/year

  const handleSubmit = async (data) => {
    try {
      const url = editingTransaction
        ? `/api/transactions/${editingTransaction._id}`
        : "/api/transactions";

      const method = editingTransaction ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save transaction");
      }

      await fetchData();
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
      setError(error.message);
    }
  };

  const handleBudgetSubmit = async (budgetData) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...budgetData,
          month: currentMonth,
          year: currentYear,
        }),
      });

      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to save budget");
      }

      await fetchData();
    } catch (error) {
      console.error("Error saving budget:", error);
      setError(error.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    // Scroll to form
    document
      .getElementById("transaction-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      await fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError(error.message);
    }
  };

  const handleBudgetEdit = async (data) => {
    try {
      const response = await fetch(`/api/budgets/${editingBudget._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          month: currentMonth,
          year: currentYear,
        }),
      });

      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to update budget");
      }

      await fetchData();
      setEditingBudget(null);
    } catch (error) {
      console.error("Error updating budget:", error);
      setError(error.message);
    }
  };

  const handleBudgetDelete = async (budgetId) => {
    if (!budgetId) {
      throw new Error('Budget ID is required');
    }

    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Failed to delete budget');
      }

      // Refresh data after successful deletion
      await fetchData();
    } catch (error) {
      console.error("Error deleting budget:", error);
      setError(error.message);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Personal Finance Tracker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Transaction Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <TransactionForm
                onSubmit={handleSubmit}
                initialData={editingTransaction}
              />
            </div>

            {/* Budget Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingBudget ? 'Edit Budget' : 'Set Budget'}
              </h2>
              <BudgetForm 
                onSubmit={editingBudget ? handleBudgetEdit : handleBudgetSubmit}
                initialData={editingBudget}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dashboard */}
            <div className="bg-white rounded-lg shadow">
              <Dashboard transactions={transactions} />
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
              <BudgetOverview 
                budgets={budgets} 
                transactions={transactions.filter(t => {
                  const date = new Date(t.date);
                  return (
                    date.toLocaleString('default', { month: 'long' }).toLowerCase() === currentMonth &&
                    date.getFullYear() === currentYear
                  );
                })}
                onEdit={setEditingBudget}
                onDelete={handleBudgetDelete}
              />
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              <TransactionList
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
