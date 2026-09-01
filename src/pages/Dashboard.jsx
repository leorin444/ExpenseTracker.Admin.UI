import { useState, useEffect } from 'react';
import { Users, LayoutDashboard, Receipt, DollarSign } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get(`${API_BASE_URL}/reports/system-totals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchStats();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="text-gray-500 p-4">Loading dashboard...</div>;
  }

  const cards = [
    { name: 'Total Users', value: stats?.TotalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Total Categories', value: stats?.TotalCategories || 0, icon: LayoutDashboard, color: 'text-purple-500', bg: 'bg-purple-100' },
    { name: 'Total Expenses', value: stats?.TotalExpensesCount || 0, icon: Receipt, color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'System Volume ($)', value: `$${Number(stats?.TotalSystemExpenses || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{card.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
