import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useLenis } from './hooks/useLenis'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import VideoShowcase from './components/VideoShowcase'
import Services from './components/Services'
import FeaturedCars from './components/FeaturedCars'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import CarsListing from './pages/CarsListing'
import CarDetail from './pages/CarDetail'
import AdminDashboard from './components/AdminDashboard'
import RoleBasedAccess from './components/RoleBasedAccess'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

// Home Page Component
const HomePage = () => {
  // Initialize Lenis smooth scrolling
  const lenis = useLenis();

  useEffect(() => {
    // Store lenis instance globally for scroll-to functionality
    if (lenis) {
      window.lenis = lenis;
    }
  }, [lenis]);

  return (
    <div className="min-h-screen">
      <CustomCursor />
      <Navbar />
      <Hero />
      <VideoShowcase />
      <Services />
      <FeaturedCars />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleBasedAccess allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleBasedAccess>
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/cars" element={<CarsListing />} />
            <Route path="/cars/:id" element={<CarDetail />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4ade80',
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: '#ef4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
