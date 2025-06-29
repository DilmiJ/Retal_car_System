import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Mail, Lock, User, Car, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Validation schema
const registerSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['user', 'dealer', 'admin'], 'Please select a valid role')
    .required('Please select your role'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    // Remove confirmPassword and terms from the data before sending to API
    const { confirmPassword: _confirmPassword, terms: _terms, ...userData } = data;

    try {
      const result = await registerUser(userData);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/facebook';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Side - Video/Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-blue-800/90 z-10 animate-pulse"></div>
        <video
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/login viedio.mov" type="video/mp4" />
          <source src="/login viedio.mov" type="video/quicktime" />
          {/* Fallback image if video doesn't load */}
          <img
            src="/login.jpeg"
            alt="CarHub Login"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Overlay Content */}
        <div className="relative z-20 flex flex-col justify-center items-center text-white p-12 animate-fade-in-up">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center text-4xl font-bold mb-6 hover:scale-110 transition-transform duration-300">
              <Car className="w-10 h-10 mr-3 animate-bounce" />
              CarHub
            </Link>
            <h1 className="text-4xl font-bold mb-4 animate-slide-in-left">
              Welcome to CarHub
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-md animate-slide-in-right">
              Your trusted platform for buying, selling, and renting premium cars
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm animate-fade-in-up delay-300">
              <div className="flex items-center hover:scale-110 transition-transform duration-200">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>Verified Dealers</span>
              </div>
              <div className="flex items-center hover:scale-110 transition-transform duration-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse delay-100"></div>
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center hover:scale-110 transition-transform duration-200">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse delay-200"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 lg:p-3 min-h-screen overflow-hidden">
        <div className="max-w-xs w-full space-y-2 animate-fade-in-up delay-200">
          {/* Mobile Header */}
          <div className="text-center lg:hidden animate-slide-in-down">
            <Link to="/" className="inline-flex items-center text-3xl font-bold text-primary-600 mb-4 hover:scale-110 transition-transform duration-300">
              <Car className="w-8 h-8 mr-2 animate-bounce" />
              CarHub
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center animate-slide-in-down delay-100">
            <h2 className="text-xl font-bold text-gray-900 mb-0.5 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-xs text-gray-600">
              Join thousands of car enthusiasts
            </p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-xl shadow-xl p-3 lg:p-4 border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-scale-in delay-300">
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                I want to join as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className={`relative flex flex-col items-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRole === 'user'
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="user"
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                    selectedRole === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <User className={`w-3 h-3 ${selectedRole === 'user' ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold ${selectedRole === 'user' ? 'text-blue-900' : 'text-gray-900'}`}>
                      User
                    </div>
                    <div className="text-xs text-gray-500">Buy cars</div>
                  </div>
                  {selectedRole === 'user' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </label>

                <label className={`relative flex flex-col items-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRole === 'dealer'
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="dealer"
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                    selectedRole === 'dealer' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <UserCheck className={`w-3 h-3 ${selectedRole === 'dealer' ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold ${selectedRole === 'dealer' ? 'text-blue-900' : 'text-gray-900'}`}>
                      Dealer
                    </div>
                    <div className="text-xs text-gray-500">Sell cars</div>
                  </div>
                  {selectedRole === 'dealer' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </label>

                <label className={`relative flex flex-col items-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRole === 'admin'
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="admin"
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                    selectedRole === 'admin' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Shield className={`w-3 h-3 ${selectedRole === 'admin' ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold ${selectedRole === 'admin' ? 'text-blue-900' : 'text-gray-900'}`}>
                      Admin
                    </div>
                    <div className="text-xs text-gray-500">Manage</div>
                  </div>
                  {selectedRole === 'admin' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-0.5">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('firstName')}
                    type="text"
                    autoComplete="given-name"
                    className={`block w-full pl-8 pr-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('lastName')}
                    type="text"
                    autoComplete="family-name"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-8 pr-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-0.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>



            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`block w-full pl-8 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('terms')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-2 text-xs">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-600">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <div className="animate-slide-in-up delay-600">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl active:scale-95 group text-sm"
              >
                {isSubmitting || isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="mr-2">Create Account</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex justify-center py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              className="w-full inline-flex justify-center py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="ml-1">Facebook</span>
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-2 text-center animate-fade-in-up delay-700">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-2 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <p className="text-xs text-gray-600 mb-2">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-2 px-3 border border-blue-600 rounded-lg text-xs font-medium text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
              >
                <span className="mr-1">Sign In</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
