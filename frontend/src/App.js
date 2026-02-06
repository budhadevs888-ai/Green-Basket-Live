import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Landing
import Landing from './pages/Landing';

// Seller
import SellerLogin from './pages/seller/SellerLogin';
import ApprovalStatus from './pages/seller/ApprovalStatus';
import DailyStock from './pages/seller/DailyStock';
import SellerLayout from './pages/seller/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerStock from './pages/seller/SellerStock';
import SellerOrders from './pages/seller/SellerOrders';
import SellerEarnings from './pages/seller/SellerEarnings';
import SellerWarnings from './pages/seller/SellerWarnings';
import SellerProfile from './pages/seller/SellerProfile';

// Customer
import CustomerLogin from './pages/customer/CustomerLogin';
import LocationSetup from './pages/customer/LocationSetup';
import CustomerHome from './pages/customer/CustomerHome';
import CustomerCart from './pages/customer/CustomerCart';
import CustomerOrders from './pages/customer/CustomerOrders';
import OrderTracking from './pages/customer/OrderTracking';
import CustomerProfile from './pages/customer/CustomerProfile';

// Delivery
import DeliveryLogin from './pages/delivery/DeliveryLogin';
import DeliveryApprovalStatus from './pages/delivery/DeliveryApprovalStatus';
import DeliveryAvailability from './pages/delivery/DeliveryAvailability';
import DeliveryActiveOrder from './pages/delivery/DeliveryActiveOrder';
import DeliveryEarnings from './pages/delivery/DeliveryEarnings';
import DeliveryHistory from './pages/delivery/DeliveryHistory';
import DeliveryProfile from './pages/delivery/DeliveryProfile';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSellers from './pages/admin/AdminSellers';
import AdminDeliveryPartners from './pages/admin/AdminDeliveryPartners';
import AdminOrders from './pages/admin/AdminOrders';
import AdminEarnings from './pages/admin/AdminEarnings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Seller Routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/approval-status" element={<ProtectedRoute requiredRole="SELLER"><ApprovalStatus /></ProtectedRoute>} />
          <Route path="/seller/daily-stock" element={<ProtectedRoute requiredRole="SELLER"><DailyStock /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute requiredRole="SELLER"><SellerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/seller/dashboard" replace />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="stock" element={<SellerStock />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="earnings" element={<SellerEarnings />} />
            <Route path="warnings" element={<SellerWarnings />} />
            <Route path="profile" element={<SellerProfile />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/location-setup" element={<ProtectedRoute requiredRole="CUSTOMER"><LocationSetup /></ProtectedRoute>} />
          <Route path="/customer/home" element={<ProtectedRoute requiredRole="CUSTOMER"><CustomerHome /></ProtectedRoute>} />
          <Route path="/customer/cart" element={<ProtectedRoute requiredRole="CUSTOMER"><CustomerCart /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute requiredRole="CUSTOMER"><CustomerOrders /></ProtectedRoute>} />
          <Route path="/customer/orders/:orderId" element={<ProtectedRoute requiredRole="CUSTOMER"><OrderTracking /></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute requiredRole="CUSTOMER"><CustomerProfile /></ProtectedRoute>} />

          {/* Delivery Routes */}
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route path="/delivery/approval-status" element={<ProtectedRoute requiredRole="DELIVERY"><DeliveryApprovalStatus /></ProtectedRoute>} />
          <Route path="/delivery/availability" element={<ProtectedRoute requiredRole="DELIVERY"><DeliveryAvailability /></ProtectedRoute>} />
          <Route path="/delivery/active-order" element={<ProtectedRoute requiredRole="DELIVERY"><DeliveryActiveOrder /></ProtectedRoute>} />
          <Route path="/delivery/earnings" element={<ProtectedRoute requiredRole="DELIVERY"><DeliveryEarnings /></ProtectedRoute>} />
          <Route path="/delivery/history" element={<ProtectedRoute requiredRole="DELIVERY"><DeliveryHistory /></ProtectedRoute>} />
          <Route path="/delivery/profile" element={<ProtectedRoute requiredRole="DELIVERY"><DeliveryProfile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="earnings" element={<AdminEarnings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
