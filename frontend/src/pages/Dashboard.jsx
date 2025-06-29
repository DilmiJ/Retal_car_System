import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Car, User, Heart, Plus, LogOut, Edit, Eye, Trash2, Clock, CheckCircle, XCircle, Camera, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import AddCarForm from '../components/AddCarForm';
import AdminNotifications from '../components/AdminNotifications';
import NotificationBadge from '../components/NotificationBadge';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userCars, setUserCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCarForm, setShowAddCarForm] = useState(false);

  useEffect(() => {
    fetchUserCars();
  }, []);

  const fetchUserCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cars/my-cars', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserCars(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching user cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <Car className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">CarHub</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Badge for Admin */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Pending Approvals"
                >
                  <NotificationBadge userRole={user?.role} />
                </button>
              )}

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('my-cars')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-cars'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Cars ({userCars.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'favorites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>

            {/* Admin-only tab */}
            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Bell className="w-4 h-4 mr-2" />
                Approvals
                <NotificationBadge userRole={user?.role} />
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab user={user} userCars={userCars} />}
        {activeTab === 'my-cars' && (
          <MyCarsTab
            userCars={userCars}
            onRefresh={fetchUserCars}
            onAddCar={() => setShowAddCarForm(true)}
          />
        )}
        {activeTab === 'favorites' && <FavoritesTab />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
        {activeTab === 'notifications' && user?.role === 'admin' && <AdminNotifications />}
      </main>

      {/* Add Car Form Modal */}
      {showAddCarForm && (
        <AddCarForm
          onClose={() => setShowAddCarForm(false)}
          onSuccess={fetchUserCars}
        />
      )}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ user, userCars }) => {
  const pendingCars = userCars.filter(car => car.status === 'pending').length;
  const activeCars = userCars.filter(car => car.status === 'active').length;
  const rejectedCars = userCars.filter(car => car.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-blue-100">
          Manage your car listings and track your sales performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cars</p>
              <p className="text-2xl font-bold text-gray-900">{userCars.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeCars}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCars}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedCars}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {userCars.length === 0 ? (
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No cars listed yet</p>
              <p className="text-sm text-gray-400">Start by adding your first car listing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userCars.slice(0, 3).map((car) => (
                <div key={car._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {car.images && car.images.length > 0 ? (
                        <img 
                          src={car.images[0]} 
                          alt={car.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Car className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{car.title}</p>
                      <p className="text-sm text-gray-500">{car.make} {car.model} • {car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      car.status === 'active' ? 'bg-green-100 text-green-800' :
                      car.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {car.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// My Cars Tab Component
const MyCarsTab = ({ userCars, onRefresh, onAddCar }) => {
  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car listing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Car listing deleted successfully');
        onRefresh();
      } else {
        toast.error('Failed to delete car listing');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Error deleting car listing');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Car Listings</h2>
        <button
          onClick={onAddCar}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Car
        </button>
      </div>

      {/* Cars Grid */}
      {userCars.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cars listed yet</h3>
          <p className="text-gray-500 mb-6">Start earning by listing your first car</p>
          <button
            onClick={onAddCar}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            List Your First Car
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCars.map((car) => (
            <div key={car._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Car Image */}
              <div className="h-48 bg-gray-200 relative">
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    car.status === 'active' ? 'bg-green-100 text-green-800' :
                    car.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {car.status}
                  </span>
                </div>

                {/* Listing Type Badge */}
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {car.listingType === 'sale' ? 'For Sale' : car.listingType === 'rent' ? 'For Rent' : 'Sale/Rent'}
                  </span>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{car.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{car.make} {car.model} • {car.year}</p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    ${car.price?.toLocaleString()}
                    {car.listingType === 'rent' && <span className="text-sm text-gray-500">/day</span>}
                  </span>
                  <span className="text-sm text-gray-500">{car.mileage?.toLocaleString()} miles</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car._id)}
                    className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Favorites Tab Component
const FavoritesTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Favorite Cars</h2>
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-500">Browse cars and add them to your favorites</p>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ user }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={user?.firstName || ''}
                readOnly
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={user?.lastName || ''}
                readOnly
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={user?.role || ''}
                readOnly
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
