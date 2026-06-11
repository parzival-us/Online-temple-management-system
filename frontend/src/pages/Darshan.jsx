import React from 'react';

export default function Darshan() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Live Darshan</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-5xl mx-auto">
        <div className="bg-gray-900 w-full relative pt-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/live_stream?channel=UC6iDIOGn92Rb476IcFgzcfw&autoplay=1&mute=1"
            title="Live Darshan"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="p-8 text-center bg-gradient-to-b from-white to-orange-50 dark:from-gray-800 dark:to-gray-900">
          <h3 className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center justify-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE: ISKCON Vrindavan
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Experience the divine presence from anywhere in the world. Join thousands of devotees in our 24/7 uninterrupted live stream of the main deity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-8 border-t border-orange-100 dark:border-gray-700 pt-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition">
              <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1 text-lg">🌅 Mangala Aarti</h4>
              <p className="text-orange-600 dark:text-orange-400 font-medium text-lg">4:30 AM (IST)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition">
              <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1 text-lg">🌙 Sandhya Aarti</h4>
              <p className="text-orange-600 dark:text-orange-400 font-medium text-lg">7:00 PM (IST)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
