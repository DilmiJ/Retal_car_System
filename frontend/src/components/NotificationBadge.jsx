import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const NotificationBadge = ({ userRole }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchUnreadCount();
      // Poll for updates every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userRole]);

  const fetchUnreadCount = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // For admin, get pending approval count
      const endpoint = userRole === 'admin' 
        ? 'http://localhost:5000/api/notifications/admin/pending'
        : 'http://localhost:5000/api/notifications/unread-count';
        
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        if (userRole === 'admin') {
          // Count pending notifications
          setUnreadCount(data.data.length);
        } else {
          // Regular user unread count
          setUnreadCount(data.count || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show badge if no notifications
  if (unreadCount === 0) {
    return (
      <div className="relative">
        <Bell className="w-6 h-6 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-gray-600" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
};

export default NotificationBadge;
