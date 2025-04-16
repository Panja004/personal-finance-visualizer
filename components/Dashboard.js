import { useTransactionData } from '../hooks/useTransactionData';
import MonthlyChart from './charts/MonthlyChart';
import CategoryChart from './charts/CategoryChart';

export default function Dashboard({ transactions }) {
  const { summary, monthlyData, categoryData } = useTransactionData(transactions);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600">Total Income</p>
          <p className="text-xl font-bold text-green-700">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">Total Expenses</p>
          <p className="text-xl font-bold text-red-700">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${
          summary.netAmount >= 0 ? 'bg-blue-50' : 'bg-yellow-50'
        }`}>
          <p className={`text-sm ${
            summary.netAmount >= 0 ? 'text-blue-600' : 'text-yellow-600'
          }`}>
            Net Balance
          </p>
          <p className={`text-xl font-bold ${
            summary.netAmount >= 0 ? 'text-blue-700' : 'text-yellow-700'
          }`}>
            {formatCurrency(summary.netAmount)}
          </p>
        </div>
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <MonthlyChart data={monthlyData} />
        <CategoryChart data={categoryData} />
      </div>
    </div>
  );
}