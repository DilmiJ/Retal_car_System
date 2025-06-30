import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Mail, Lock, Car, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = 'http://localhost:5000/api/auth/google';
    } catch {
      toast.error('Google OAuth is not configured. Please contact support.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      window.location.href = 'http://localhost:5000/api/auth/facebook';
    } catch {
      toast.error('Facebook OAuth is not configured. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Page Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/login.mp4" type="video/mp4" />
        {/* Fallback image if video doesn't load */}
        <img
          src="/images/login-fallback.jpg"
          alt="CarHub Login"
          className="w-full h-full object-cover"
        />
      </video>

      {/* Login Form Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 animate-fade-in-up delay-200">
          {/* Header */}
          <div className="text-center animate-slide-in-down">
            <Link to="/" className="inline-flex items-center text-4xl font-bold text-white mb-6 hover:scale-110 transition-transform duration-300">
              <Car className="w-10 h-10 mr-3 animate-bounce" />
              CarHub
            </Link>
            <h2 className="text-4xl font-bold text-white mb-4 animate-slide-in-left">
              Welcome Back
            </h2>
            <p className="text-xl text-white/90 mb-8 animate-slide-in-right">
              Sign in to access your dashboard and manage your car listings
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 hover:shadow-3xl transition-all duration-300 animate-scale-in delay-300">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="animate-slide-in-left delay-400">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-primary-600">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className={`block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-400 focus:scale-[1.02] text-gray-900 placeholder-gray-500 ${
                      errors.email ? 'border-red-300 animate-shake' : ''
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`block w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors hover:border-gray-400 text-gray-900 placeholder-gray-500 ${
                      errors.password ? 'border-red-300' : ''
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="animate-slide-in-up delay-600">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl active:scale-95 group"
                >
                  {isSubmitting || isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="mr-2">Sign In</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={handleFacebookLogin}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center animate-fade-in-up delay-700">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-primary-300 transition-all duration-300 hover:shadow-md">
                <p className="text-sm text-gray-600 mb-3">
                  Don't have an account?
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full py-3 px-4 border border-primary-600 rounded-lg text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                >
                  <span className="mr-2">Create Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
