import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Car, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Validation schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email);
    if (result.success) {
      setEmailAddress(data.email);
      setIsEmailSent(true);
    }
  };

  const handleResendEmail = async () => {
    const result = await forgotPassword(emailAddress);
    if (result.success) {
      // Email sent again
    }
  };

  if (isEmailSent) {
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
          <source src="/videos/forgot-password.mp4" type="video/mp4" />
          <img
            src="/images/forgot-password-fallback.jpg"
            alt="CarHub Forgot Password"
            className="w-full h-full object-cover"
          />
        </video>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6">
            {/* Header */}
            <div className="text-center">
              <Link to="/" className="inline-flex items-center text-4xl font-bold text-white mb-6">
                <Car className="w-10 h-10 mr-3" />
                CarHub
              </Link>
            </div>

            {/* Success Message */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-200">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check your email
              </h2>

              <p className="text-gray-700 mb-6">
                We've sent a password reset link to:
              </p>

              <div className="bg-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
                <p className="font-medium text-gray-900">{emailAddress}</p>
              </div>

              <p className="text-sm text-gray-600 mb-8">
                Didn't receive the email? Check your spam folder or click the button below to resend.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleResendEmail}
                  className="w-full flex justify-center items-center py-3 px-4 border border-blue-300 rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
                >
                  Resend Email
                </button>

                <Link
                  to="/login"
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <img
          src="/images/login-fallback.jpg"
          alt="CarHub Forgot Password"
          className="w-full h-full object-cover"
        />
      </video>

      {/* Forgot Password Form Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 animate-fade-in-up delay-200">
          {/* Header */}
          <div className="text-center animate-slide-in-down">
            <Link to="/" className="inline-flex items-center text-4xl font-bold text-white mb-6 hover:scale-110 transition-transform duration-300">
              <Car className="w-10 h-10 mr-3 animate-bounce" />
              CarHub
            </Link>
            <h2 className="text-4xl font-bold text-white mb-4 animate-slide-in-left">
              Reset Password
            </h2>
            <p className="text-xl text-white/90 mb-8 animate-slide-in-right">
              Don't worry, we'll help you get back into your account securely
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 hover:shadow-3xl transition-all duration-300 animate-scale-in delay-300">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className={`block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900 placeholder-gray-500 ${
                      errors.email ? 'border-red-300' : ''
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Login
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Having trouble?
              </h3>
              <p className="text-sm text-gray-600">
                If you don't receive an email within a few minutes, please check your spam folder or{' '}
                <Link to="/contact" className="text-primary-600 hover:text-primary-500">
                  contact our support team
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
