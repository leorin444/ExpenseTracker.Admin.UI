import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, Receipt, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Categories', path: '/categories', icon: FolderKanban },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
        <h1 className="text-xl font-bold text-primary truncate">Expense Admin</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-50 text-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 truncate mb-4">
            {currentUser?.email}
          </p>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
