import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let intervalId;
    if (user?.role === 'admin') {
      const fetchStats = () => {
        const token = localStorage.getItem('token');
        axios.get((import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000') + '/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setStats(res.data)).catch(console.error);
      };

      // Initial fetch
      fetchStats();

      // Poll every 5 seconds for real-time updates
      intervalId = setInterval(fetchStats, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  // Use real data from backend, or fallback to empty state
  const chartData = stats?.chart_data || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome, {user.name}</h2>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border-t-4 border-orange-500 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/donations')}>
          <h3 className="text-xl font-semibold mb-2">My Donations</h3>
          <p className="text-gray-600 dark:text-gray-300">View your donation history and download receipts.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border-t-4 border-blue-500 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/gallery')}>
          <h3 className="text-xl font-semibold mb-2">Temple Gallery</h3>
          <p className="text-gray-600 dark:text-gray-300">Check out temple photos and festival highlights.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border-t-4 border-purple-500 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/events')}>
          <h3 className="text-xl font-semibold mb-2">Temple Events</h3>
          <p className="text-gray-600 dark:text-gray-300">View and register for upcoming festivals.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border-t-4 border-green-500 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/darshan')}>
          <h3 className="text-xl font-semibold mb-2">Live Darshan</h3>
          <p className="text-gray-600 dark:text-gray-300">Watch the live stream from the temple.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border-t-4 border-yellow-500 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/prasad')}>
          <h3 className="text-xl font-semibold mb-2">Book Prasad</h3>
          <p className="text-gray-600 dark:text-gray-300">Order prasad for home delivery.</p>
        </div>
      </div>
      
      {user.role === 'admin' && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Admin Dashboard Overview</h3>
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 p-4 rounded text-center border">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.total_users}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 p-4 rounded text-center border">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Donations</p>
                <p className="text-3xl font-bold text-green-600">Rs. {stats.total_donations_amount}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 p-4 rounded text-center border">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Events</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total_events}</p>
              </div>
            </div>
          )}

          <div className="h-80 w-full mt-4">
            <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Donation Trends</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-md rounded">
                          <p className="text-gray-800 dark:text-gray-100 font-semibold">{`${label}`}</p>
                          <p className="text-orange-500 font-bold">{`Donations: Rs. ${payload[0].value}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="donations" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
