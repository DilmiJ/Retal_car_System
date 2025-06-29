import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },
};

// Cars API functions
export const carsAPI = {
  // Get all cars
  getCars: async (params = {}) => {
    const response = await api.get('/cars', { params });
    return response.data;
  },

  // Get single car
  getCar: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  // Create car listing
  createCar: async (carData) => {
    const response = await api.post('/cars', carData);
    return response.data;
  },

  // Update car listing
  updateCar: async (id, carData) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },

  // Delete car listing
  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const response = await api.post(`/cars/${id}/favorite`);
    return response.data;
  },

  // Get user favorites
  getFavorites: async (params = {}) => {
    const response = await api.get('/cars/favorites', { params });
    return response.data;
  },

  // Get user listings
  getMyListings: async (params = {}) => {
    const response = await api.get('/cars/my-listings', { params });
    return response.data;
  },
};

// Users API functions
export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Update avatar
  updateAvatar: async (avatar) => {
    const response = await api.put('/users/avatar', { avatar });
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },
};

// Upload API functions
export const uploadAPI = {
  // Upload single image
  uploadImage: async (imageData) => {
    const response = await api.post('/upload/image', imageData);
    return response.data;
  },

  // Upload multiple images
  uploadImages: async (imagesData) => {
    const response = await api.post('/upload/images', imagesData);
    return response.data;
  },

  // Validate image
  validateImage: async (image) => {
    const response = await api.post('/upload/validate', { image });
    return response.data;
  },

  // Get upload limits
  getUploadLimits: async () => {
    const response = await api.get('/upload/limits');
    return response.data;
  },
};

export default api;
