import React, { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hari Om! How can I assist you today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/chat/', { message: userMsg });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error connecting to my knowledge base.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 w-80 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-[400px]">
          <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold">Temple Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-orange-50 dark:bg-gray-900 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-2 border rounded-l focus:outline-none focus:ring focus:ring-orange-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Type your message..."
            />
            <button onClick={handleSend} className="bg-orange-600 text-white px-4 rounded-r hover:bg-orange-700 transition">
              Send
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-700 transition transform hover:scale-110 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
