import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Star, Users, Car, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Banner data with information
  const banners = [
    {
      image: '/banner1.jpg',
      title: 'Luxury Sports Cars',
      description: 'Experience the thrill of premium sports cars with unmatched performance and style.',
      highlight: 'Starting from $45,000'
    },
    {
      image: '/banner2.jpg',
      title: 'Family SUVs',
      description: 'Spacious and safe SUVs perfect for family adventures and daily commutes.',
      highlight: 'Best Safety Ratings'
    },
    {
      image: '/banner3.jpg',
      title: 'Electric Vehicles',
      description: 'Go green with our eco-friendly electric cars featuring cutting-edge technology.',
      highlight: 'Zero Emissions'
    },
    {
      image: '/banner4.jpg',
      title: 'Classic Collection',
      description: 'Discover timeless classics and vintage cars that never go out of style.',
      highlight: 'Collector\'s Choice'
    },
    {
      image: '/banner5.jpg',
      title: 'Compact Cars',
      description: 'Efficient and affordable compact cars perfect for city driving and parking.',
      highlight: 'Best Fuel Economy'
    },
    {
      image: '/banner6.jpg',
      title: 'Luxury Sedans',
      description: 'Premium sedans offering comfort, elegance, and advanced features.',
      highlight: 'Executive Class'
    }
  ];

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Main Heading */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Find Your Perfect
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Dream Car
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Buy, sell, or rent cars with confidence. Discover thousands of verified vehicles from trusted dealers and private sellers.
                </motion.p>
              </div>

              {/* Search Bar */}
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by make, model, or location..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <motion.button
                    onClick={() => navigate('/cars')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Your Journey
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-2 mx-auto">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Cars Available</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-2 mx-auto">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">25K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-2 mx-auto">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Banner Carousel */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentBanner}
                    className="relative w-full h-full"
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {/* Banner Image */}
                    <img
                      src={banners[currentBanner].image}
                      alt={banners[currentBanner].title}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      onLoad={() => setImageLoaded(true)}
                      onLoadStart={() => setImageLoaded(false)}
                    />

                    {/* Loading Overlay */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-gray-400">Loading...</div>
                      </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Banner Content */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                          {banners[currentBanner].highlight}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                          {banners[currentBanner].title}
                        </h3>
                        <p className="text-gray-200 text-sm sm:text-base max-w-md">
                          {banners[currentBanner].description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <motion.button
                  onClick={prevBanner}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>

                <motion.button
                  onClick={nextBanner}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentBanner
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>


            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
