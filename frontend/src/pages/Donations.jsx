import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import QRCode from 'react-qr-code';

export default function Donations() {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General Fund');
  const [donations, setDonations] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [upiString, setUpiString] = useState('');

  const upiId = 'saswat07@slc';
  const templeName = 'Sri Temple Trust';

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5000/api/donations/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateQR = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    
    // Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR
    const str = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(templeName)}&am=${amount}&cu=INR`;
    setUpiString(str);
    setShowQR(true);
  };

  const handleConfirmDonation = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5000/api/donations/', 
        { amount, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Donation recorded successfully! Check your email for the receipt.');
      setShowQR(false);
      setAmount('');
      fetchDonations();
    } catch (err) {
      alert('Error recording donation');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">Online Donations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Donation Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border-t-4 border-orange-500">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">Make a Contribution</h3>
          {!showQR ? (
            <form onSubmit={handleGenerateQR} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Amount (INR)</label>
                <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 mt-1 focus:ring focus:ring-orange-200" required />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 mt-1">
                  <option>General Fund</option>
                  <option>Annadanam</option>
                  <option>Building Fund</option>
                  <option>Festival Celebration</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 font-bold transition">
                Proceed to Pay
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-300">Scan this QR code with any UPI app (GPay, PhonePe, Paytm) to pay <strong>Rs. {amount}</strong></p>
              <div className="flex justify-center bg-white dark:bg-gray-800 p-4 inline-block mx-auto rounded shadow-inner">
                <QRCode value={upiString} size={200} />
              </div>
              <div className="mt-6 space-y-2">
                <button onClick={handleConfirmDonation} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold transition">
                  I have completed the payment
                </button>
                <button onClick={() => setShowQR(false)} className="w-full text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:text-gray-200">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Donation History */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border-t-4 border-blue-500">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">My Donation History</h3>
          {donations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No donations found.</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {donations.map(d => (
                <div key={d.id} className="border p-4 rounded bg-gray-50 dark:bg-gray-900 dark:bg-gray-700 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">Rs. {d.amount}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{d.category}</p>
                    <p className="text-xs text-gray-400">{new Date(d.date).toLocaleDateString()}</p>
                  </div>
                  {d.receipt_url && (
                    <button onClick={() => alert('PDF generation is simulated in backend. Receipt URL: ' + d.receipt_url)} className="text-blue-500 text-sm hover:underline">
                      View Receipt
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
