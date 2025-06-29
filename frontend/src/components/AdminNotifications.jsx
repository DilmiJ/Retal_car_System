import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Car, Clock, User, MapPin, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    fetchPendingNotifications();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPendingNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications/admin/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      } else {
        toast.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (carId, notificationId) => {
    if (processingIds.has(carId)) return;

    setProcessingIds(prev => new Set(prev).add(carId));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cars/${carId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Car listing approved successfully!');
        // Remove the notification from the list
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
      } else {
        toast.error(data.message || 'Failed to approve car listing');
      }
    } catch (error) {
      console.error('Error approving car:', error);
      toast.error('Error approving car listing');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(carId);
        return newSet;
      });
    }
  };

  const handleReject = async (carId, notificationId, reason = '') => {
    if (processingIds.has(carId)) return;

    const rejectionReason = reason || prompt('Please provide a reason for rejection (optional):');
    
    setProcessingIds(prev => new Set(prev).add(carId));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cars/${carId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Car listing rejected and removed');
        // Remove the notification from the list
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
      } else {
        toast.error(data.message || 'Failed to reject car listing');
      }
    } catch (error) {
      console.error('Error rejecting car:', error);
      toast.error('Error rejecting car listing');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(carId);
        return newSet;
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Bell className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Car Approvals
          </h2>
          <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
            <p className="text-gray-500">All car listings have been reviewed.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {notification.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {notification.message}
                  </p>

                  {notification.relatedCar && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-4">
                        {notification.relatedCar.images && notification.relatedCar.images.length > 0 && (
                          <img
                            src={notification.relatedCar.images[0]}
                            alt={notification.relatedCar.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {notification.relatedCar.title}
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Car className="w-4 h-4 mr-1" />
                              {notification.relatedCar.year} {notification.relatedCar.make} {notification.relatedCar.model}
                            </div>
                            
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatPrice(notification.relatedCar.price)}
                            </div>
                            
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {notification.metadata?.ownerName}
                            </div>
                            
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {notification.relatedCar.location?.city}, {notification.relatedCar.location?.state}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                  onClick={() => handleReject(notification.relatedCar._id, notification._id)}
                  disabled={processingIds.has(notification.relatedCar._id)}
                  className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4 mr-2" />
                  {processingIds.has(notification.relatedCar._id) ? 'Processing...' : 'Reject'}
                </button>
                
                <button
                  onClick={() => handleApprove(notification.relatedCar._id, notification._id)}
                  disabled={processingIds.has(notification.relatedCar._id)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {processingIds.has(notification.relatedCar._id) ? 'Processing...' : 'Approve'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
