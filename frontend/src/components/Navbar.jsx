import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.nav
      className="bg-white/90 backdrop-blur-md shadow-lg fixed w-full top-0 left-0 right-0 z-50 border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Car className="h-6 w-6 text-white" />
              </motion.div>
              <motion.span
                className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                CarHub
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#home" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#buy" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Buy Cars
              </a>
              <a href="#sell" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Sell Cars
              </a>
              <a href="#rent" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Rent Cars
              </a>
              <a href="#about" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">
                    {user?.firstName}
                  </span>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                    {user?.role}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#home" className="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </a>
              <a href="#buy" className="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
                Buy Cars
              </a>
              <a href="#sell" className="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
                Sell Cars
              </a>
              <a href="#rent" className="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
                Rent Cars
              </a>
              <a href="#about" className="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
                Contact
              </a>
              <div className="flex flex-col space-y-2 px-3 py-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <span className="text-gray-700 font-medium">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        {user?.role}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="text-primary-600 hover:text-primary-700 font-medium text-left px-3 py-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-700 font-medium text-left px-3 py-2"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
