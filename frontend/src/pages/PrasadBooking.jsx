import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function PrasadBooking() {
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post((import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000') + '/api/prasad/', 
        { address }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Prasad booking successful!');
      setAddress('');
    } catch (error) {
      setMessage('Failed to book prasad. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">Book Home Delivery of Prasad</h2>
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border-t-4 border-orange-500">
        {message && <div className="mb-4 text-center text-orange-600 font-semibold">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Delivery Address</label>
            <textarea
              required
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-orange-200 outline-none transition dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Enter your complete postal address..."
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
