import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  Users, 
  FolderKanban, 
  RefreshCw, 
  Calendar,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchReportData();
    }
  }, [currentUser]);

  async function fetchReportData() {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await axios.get(`${API_BASE_URL}/reports/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportData(response.data);
    } catch (error) {
      console.error("Failed to load report analytics", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
        <p className="font-medium">Aggregating database reports & financial metrics...</p>
      </div>
    );
  }

  const totals = reportData?.totals || {};
  const monthlyTrends = reportData?.monthlyTrends || [];
  const categoryBreakdown = reportData?.categoryBreakdown || [];
  const topSpenders = reportData?.topSpenders || [];

  const totalVolume = Number(totals.TotalSystemVolume || 0);

  // Find max monthly spend for scaling the bar
  const maxMonthSpend = Math.max(...monthlyTrends.map(m => Number(m.TotalAmount || 0)), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Reports & Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time financial analytics aggregated from the SQL database.
          </p>
        </div>

        <button
          onClick={fetchReportData}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Total System Volume</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totals.TotalExpensesCount || 0}
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Receipt className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Average Expense</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${Number(totals.AverageExpenseAmount || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totals.TotalCategories || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <FolderKanban className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Trend */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-bold text-gray-900">Monthly Spending Overview</h3>
            </div>
          </div>

          {monthlyTrends.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No monthly data available yet.</div>
          ) : (
            <div className="space-y-4">
              {monthlyTrends.map((month) => {
                const amount = Number(month.TotalAmount || 0);
                const percent = Math.min(100, Math.round((amount / maxMonthSpend) * 100));

                return (
                  <div key={month.MonthYear} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-700">{month.MonthYear}</span>
                      <span className="text-gray-900">${amount.toFixed(2)} ({month.ExpenseCount} txns)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Spending Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-bold text-gray-900">Spending by Category</h3>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No category breakdown available.</div>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.map((cat) => {
                const amount = Number(cat.TotalAmount || 0);
                const percent = totalVolume > 0 ? Math.round((amount / totalVolume) * 100) : 0;

                return (
                  <div key={cat.CategoryId} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-gray-800">
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block" 
                          style={{ backgroundColor: cat.Color || '#4F46E5' }} 
                        />
                        {cat.CategoryName}
                      </span>
                      <span className="text-gray-900">
                        ${amount.toFixed(2)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%`, backgroundColor: cat.Color || '#4F46E5' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top 10 Spenders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-gray-900">Top Spending Users</h3>
          </div>
        </div>

        {topSpenders.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No user spending records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firebase UID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topSpenders.map((user, idx) => (
                  <tr key={user.UserId} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {user.Email || `User #${user.UserId}`}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-xs text-gray-500 font-mono">
                      {user.FirebaseUid || 'N/A'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {user.ExpenseCount} expenses
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm font-bold text-emerald-600 text-right">
                      ${Number(user.TotalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
