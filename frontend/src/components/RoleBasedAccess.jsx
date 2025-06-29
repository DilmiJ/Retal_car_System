import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';

const RoleBasedAccess = ({ 
  allowedRoles = [], 
  children, 
  fallback = null,
  showMessage = true 
}) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, show login message
  if (!isAuthenticated) {
    if (!showMessage) return fallback;
    
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to access this page.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If user doesn't have required role, show access denied
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (!showMessage) return fallback;
    
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              <strong>Your role:</strong> {user?.role || 'Unknown'}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Required roles:</strong> {allowedRoles.join(', ')}
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User has access, render children
  return children;
};

// Higher-order component for role-based access
export const withRoleAccess = (WrappedComponent, allowedRoles = []) => {
  return function RoleProtectedComponent(props) {
    return (
      <RoleBasedAccess allowedRoles={allowedRoles}>
        <WrappedComponent {...props} />
      </RoleBasedAccess>
    );
  };
};

// Hook for checking user permissions
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role) => {
    return isAuthenticated && user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return isAuthenticated && roles.includes(user?.role);
  };

  const canAccess = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return hasAnyRole(requiredRoles);
  };

  const isAdmin = () => hasRole('admin');
  const isDealer = () => hasRole('dealer');
  const isUser = () => hasRole('user');

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    canAccess,
    isAdmin,
    isDealer,
    isUser
  };
};

// Component for conditional rendering based on roles
export const RoleGuard = ({ roles, children, fallback = null }) => {
  const { canAccess } = usePermissions();
  
  if (canAccess(roles)) {
    return children;
  }
  
  return fallback;
};

// Component for showing different content based on user role
export const RoleSwitch = ({ children }) => {
  const { user } = useAuth();
  
  const roleComponents = React.Children.toArray(children);
  const matchingComponent = roleComponents.find(child => {
    if (React.isValidElement(child) && child.props.role) {
      return child.props.role === user?.role;
    }
    return false;
  });
  
  // Look for default component if no role matches
  const defaultComponent = roleComponents.find(child => {
    if (React.isValidElement(child) && child.props.default) {
      return true;
    }
    return false;
  });
  
  return matchingComponent || defaultComponent || null;
};

// Component for role-specific content
export const RoleContent = ({ role, default: isDefault, children }) => {
  return children;
};

export default RoleBasedAccess;
