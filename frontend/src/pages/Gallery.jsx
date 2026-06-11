import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/gallery/')
      .then(res => setImages(res.data))
      .catch(err => console.error("Failed to load gallery", err));
  }, []);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev + 1) % images.length);
    }
  }, [selectedIndex, images.length]);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [selectedIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  // Adding a simple fade animation for the modal
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedIndex]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Temple Gallery</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {images.map((img, index) => (
          <div 
            key={img.id} 
            onClick={() => setSelectedIndex(index)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative overflow-hidden aspect-[4/3]">
              <img 
                src={img.image_url} 
                alt={img.title} 
                className="w-full h-full object-cover transform transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300 font-semibold text-lg tracking-wide drop-shadow-lg">
                  View Image
                </span>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{img.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Full Screen Lightbox Modal with Slideshow */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-md p-4 transition-opacity duration-300"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            className="absolute top-6 right-8 text-white hover:text-orange-500 text-5xl font-light transition duration-200 z-[110]"
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
            aria-label="Close"
          >
            &times;
          </button>
          
          <button 
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500 text-6xl font-light transition duration-200 p-4 z-[110]"
            onClick={handlePrev}
            aria-label="Previous"
          >
            &#10094;
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
            <img 
              src={images[selectedIndex].image_url} 
              alt={images[selectedIndex].title} 
              className="max-h-[85vh] max-w-[85vw] md:max-w-[75vw] rounded shadow-2xl object-contain border border-gray-800 pointer-events-auto"
              onClick={(e) => e.stopPropagation()} 
            />
            <div className="flex flex-col items-center mt-6">
              <h3 className="text-white text-2xl font-light tracking-wider">{images[selectedIndex].title}</h3>
              <p className="text-gray-400 text-sm mt-2">{selectedIndex + 1} of {images.length}</p>
            </div>
          </div>

          <button 
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500 text-6xl font-light transition duration-200 p-4 z-[110]"
            onClick={handleNext}
            aria-label="Next"
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}
