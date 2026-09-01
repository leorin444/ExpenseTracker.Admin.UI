import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import { Trash2, RefreshCw, Database } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [alert, setAlert] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  function showAlert(message, type = 'success') {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users from database", error);
      showAlert("Failed to load users from database.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncFirebaseUsers() {
    setSyncing(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await axios.post(
        `${API_BASE_URL}/users/sync-firebase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert(response.data.message || "Users synchronized successfully.", "success");
      // Refresh the database user list
      await fetchUsers();
    } catch (error) {
      console.error("Failed to sync users from Firebase", error);
      const errorMsg = error.response?.data?.message || "Failed to sync users from Firebase.";
      showAlert(errorMsg, "error");
    } finally {
      setSyncing(false);
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Are you sure you want to delete user "${user.Email}" and all associated expenses? This cannot be undone.`)) {
      return;
    }
    
    try {
      const token = await currentUser.getIdToken();
      const deleteIdentifier = user.FirebaseUid || user.Id;
      await axios.delete(`${API_BASE_URL}/users/${deleteIdentifier}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert("User and associated data deleted successfully.", "success");
      // Refresh the list after deletion
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      showAlert("Error deleting user from database.", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {alert && (
        <div className={`p-4 rounded-lg flex items-center justify-between shadow-sm transition-all ${
          alert.type === 'error' 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-green-50 text-green-800 border border-green-200'
        }`}>
          <span className="text-sm font-medium">{alert.message}</span>
          <button onClick={() => setAlert(null)} className="text-sm font-bold ml-4">✕</button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Registered users stored in the database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleSyncFirebaseUsers}
            disabled={syncing}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none transition-colors disabled:opacity-50"
          >
            <Database className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing New Users...' : 'Sync Users from Firebase'}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users from database...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found in database. Click "Sync Users from Firebase" to import newly registered users.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expenses</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.Id || user.FirebaseUid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.Email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.CreatedAt ? new Date(user.CreatedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {user.TotalExpenses ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(user)} 
                      className="text-red-600 hover:text-red-900 inline-flex items-center font-medium"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
