import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './screens/LoginScreen';
import { LocationSetupScreen } from './screens/LocationSetupScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CartScreen } from './screens/CartScreen';
import { OrderConfirmScreen } from './screens/OrderConfirmScreen';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Location required route wrapper
const LocationRequiredRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, hasLocation } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!hasLocation) {
    return <Navigate to="/location-setup" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, hasLocation } = useApp();

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            hasLocation ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/location-setup" replace />
            )
          ) : (
            <LoginScreen />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/location-setup"
        element={
          <ProtectedRoute>
            <LocationSetupScreen />
          </ProtectedRoute>
        }
      />

      {/* Location Required Routes */}
      <Route
        path="/home"
        element={
          <LocationRequiredRoute>
            <HomeScreen />
          </LocationRequiredRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <LocationRequiredRoute>
            <CartScreen />
          </LocationRequiredRoute>
        }
      />

      <Route
        path="/order-confirm"
        element={
          <LocationRequiredRoute>
            <OrderConfirmScreen />
          </LocationRequiredRoute>
        }
      />

      <Route
        path="/order-tracking/:orderId"
        element={
          <LocationRequiredRoute>
            <OrderTrackingScreen />
          </LocationRequiredRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <LocationRequiredRoute>
            <OrdersScreen />
          </LocationRequiredRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <LocationRequiredRoute>
            <ProfileScreen />
          </LocationRequiredRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <LocationRequiredRoute>
            <CategoriesScreen />
          </LocationRequiredRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster position="top-center" />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;