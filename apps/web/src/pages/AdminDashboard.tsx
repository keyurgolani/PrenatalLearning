import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services';
import { useTheme } from '../contexts/ThemeContext';

interface UserStats {
  userId: string;
  email: string;
  dueDate?: string;
  createdAt: string;
  lastLoginAt: string;
  kickCount: number;
  journalCount: number;
}

interface StatsResponse {
  totalUsers: number;
  userStats: UserStats[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const backgroundClass = currentTheme.colors.background;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get<StatsResponse>('/admin/stats');
      setStats(response);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Failed to load stats');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/admin/logout');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${backgroundClass}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Calculate some aggregate metrics
  const totalKicks = stats?.userStats.reduce((acc, user) => acc + user.kickCount, 0) || 0;
  const totalEntries = stats?.userStats.reduce((acc, user) => acc + user.journalCount, 0) || 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} font-sans transition-all duration-500`}>
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Prenatal Admin
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Users Card */}
            <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl transform transition-all hover:scale-105 duration-200 border border-white/20">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-xl p-3">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stats.totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Kicks Card */}
            <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl transform transition-all hover:scale-105 duration-200 border border-white/20">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-pink-100 text-pink-600 rounded-xl p-3">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Kicks</dt>
                      <dd className="text-2xl font-bold text-gray-900">{totalKicks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Journal Entries Card */}
            <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl transform transition-all hover:scale-105 duration-200 border border-white/20">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 text-yellow-600 rounded-xl p-3">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Journal Entries</dt>
                      <dd className="text-2xl font-bold text-gray-900">{totalEntries}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

             {/* Avg Engagement Card */}
             <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl transform transition-all hover:scale-105 duration-200 border border-white/20">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 text-green-600 rounded-xl p-3">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Data/User</dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {stats.totalUsers ? ((totalKicks + totalEntries) / stats.totalUsers).toFixed(1) : 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Table */}
        {stats && (
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100 bg-white/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Registered Users</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {stats.totalUsers} found
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Kicks</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Entries</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-200/50">
                  {stats.userStats.map((user) => (
                    <tr key={user.userId} className="hover:bg-indigo-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {user.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                           <span>{user.email}</span>
                           <a 
                             href={`mailto:${user.email}`}
                             className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                           >
                             Contact
                           </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex flex-col">
                          <span>{new Date(user.lastLoginAt).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-400">{new Date(user.lastLoginAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                         {user.dueDate ? (
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                             {new Date(user.dueDate).toLocaleDateString()}
                           </span>
                         ) : (
                           <span className="text-gray-400">-</span>
                         )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${user.kickCount > 0 ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-400'}`}>
                          {user.kickCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${user.journalCount > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'}`}>
                          {user.journalCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
