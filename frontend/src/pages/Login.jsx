import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Admin / Devotee Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring focus:ring-orange-200" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring focus:ring-orange-200" required />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-orange-500 hover:underline text-sm">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
