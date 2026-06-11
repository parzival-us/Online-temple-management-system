import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Events() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const fetchEvents = () => {
    axios.get('http://127.0.0.1:5000/api/events/')
      .then(res => setEvents(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5000/api/events/', 
        { title, description, date: new Date(date).toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      setDate('');
      fetchEvents();
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Upcoming Temple Events</h2>

      {user?.role === 'admin' && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Create New Event (Admin)</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200">Event Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring focus:ring-orange-200" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200">Date & Time</label>
              <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring focus:ring-orange-200" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring focus:ring-orange-200" rows="3"></textarea>
            </div>
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 font-bold transition">Publish Event</button>
          </form>
        </div>
      )}

      {events.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No upcoming events scheduled at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(e => (
            <div key={e.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">{e.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{new Date(e.date).toLocaleString()}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{e.description}</p>
              
              {user?.role === 'admin' && (
                <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">
                  Delete Event
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
