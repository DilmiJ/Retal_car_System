import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Banner images array
  const bannerImages = [
    '/banners/1.jpg',
    '/banners/2.jpg',
    '/banners/3.jpg',
    '/banners/4.jpg',
    '/banners/5.jpg'
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, bannerImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Banner Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <img
            src={bannerImages[currentSlide]}
            alt={`Banner ${currentSlide + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10"
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10"
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {bannerImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div
          className={`w-2 h-2 rounded-full ${
            isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'
          }`}
          animate={{
            scale: isAutoPlaying ? [1, 1.2, 1] : 1,
            opacity: isAutoPlaying ? [1, 0.7, 1] : 0.7,
          }}
          transition={{
            duration: 2,
            repeat: isAutoPlaying ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default BannerCarousel;
