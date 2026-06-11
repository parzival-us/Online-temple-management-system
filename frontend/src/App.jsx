import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Darshan from './pages/Darshan';
import PrasadBooking from './pages/PrasadBooking';
import Gallery from './pages/Gallery';
import Chatbot from './components/Chatbot';
import Donations from './pages/Donations';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Events from './pages/Events';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center transition-colors duration-200">
          <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400">Temple Management</h1>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? '🌞 Light' : '🌙 Dark'}
          </button>
        </nav>
        <div className="container mx-auto p-4 relative">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/darshan" element={<Darshan />} />
            <Route path="/prasad" element={<ProtectedRoute><PrasadBooking /></ProtectedRoute>} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
          <Chatbot />
        </div>
      </div>
    </Router>
  );
}

export default App;
