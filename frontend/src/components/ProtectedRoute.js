import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="loading-screen">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token || !user) {
    if (requiredRole === 'SELLER') return <Navigate to="/seller/login" replace />;
    if (requiredRole === 'CUSTOMER') return <Navigate to="/customer/login" replace />;
    if (requiredRole === 'DELIVERY') return <Navigate to="/delivery/login" replace />;
    if (requiredRole === 'ADMIN') return <Navigate to="/admin/login" replace />;
    return <Navigate to="/" replace />;
  }

  const userRole = user.role || '';
  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
