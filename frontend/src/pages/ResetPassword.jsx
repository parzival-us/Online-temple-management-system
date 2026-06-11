import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post((import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000') + '/api/auth/reset-password', { token, password });
      setMessage('Password reset successfully. You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'An error occurred.');
    }
  };

  if (!token) {
    return <div className="text-center mt-10">Invalid or missing reset token.</div>;
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Reset Password</h2>
        {message && <div className="mb-4 text-center text-orange-600 font-semibold">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring focus:ring-orange-200" required />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
