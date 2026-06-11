import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/forgot-password', { email });
      setMessage('If an account exists, a reset link will be sent to your email.');
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Forgot Password</h2>
        {message && <div className="mb-4 text-center text-green-600 font-semibold">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring focus:ring-orange-200" required />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition">
            Send Reset Link
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-orange-500 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
