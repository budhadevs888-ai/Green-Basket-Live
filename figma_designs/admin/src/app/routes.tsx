import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Sellers } from './pages/Sellers';
import { DeliveryPartners } from './pages/DeliveryPartners';
import { Orders } from './pages/Orders';
import { Earnings } from './pages/Earnings';
import { Users } from './pages/Users';
import { AuditLogs } from './pages/AuditLogs';
import { Profile } from './pages/Profile';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'sellers',
        element: <Sellers />,
      },
      {
        path: 'delivery-partners',
        element: <DeliveryPartners />,
      },
      {
        path: 'orders',
        element: <Orders />,
      },
      {
        path: 'earnings',
        element: <Earnings />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogs />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
