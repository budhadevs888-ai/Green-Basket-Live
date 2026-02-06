import React, { useState } from 'react';
import { ShoppingBasket } from 'lucide-react';

// Import screens
import SellerLogin from './components/screens/SellerLogin';
import ApprovalStatus from './components/screens/ApprovalStatus';
import DailyStockConfirmation from './components/screens/DailyStockConfirmation';
import SellerDashboard from './components/screens/SellerDashboard';
import ProductsManagement from './components/screens/ProductsManagement';
import StockManagement from './components/screens/StockManagement';
import Orders from './components/screens/Orders';
import Earnings from './components/screens/Earnings';
import WarningsCompliance from './components/screens/WarningsCompliance';
import Profile from './components/screens/Profile';
import Sidebar from './components/Sidebar';

export type ApprovalStatus = 'PENDING' | 'DOCUMENT_VERIFICATION' | 'LOCATION_VERIFICATION' | 'APPROVED' | 'REJECTED';

export interface SellerState {
  isLoggedIn: boolean;
  approvalStatus: ApprovalStatus;
  stockConfirmedToday: boolean;
  shopName: string;
  phoneNumber: string;
  location: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [sellerState, setSellerState] = useState<SellerState>({
    isLoggedIn: false,
    approvalStatus: 'PENDING',
    stockConfirmedToday: false,
    shopName: '',
    phoneNumber: '',
    location: '',
  });

  // Determine which screen to show based on seller state
  const getActiveScreen = () => {
    if (!sellerState.isLoggedIn) {
      return 'login';
    }
    
    if (sellerState.approvalStatus !== 'APPROVED') {
      return 'approval';
    }
    
    if (!sellerState.stockConfirmedToday) {
      return 'stock-confirmation';
    }
    
    return currentScreen;
  };

  const handleLogin = (phone: string) => {
    // Mock login - in real app, this would call backend
    setSellerState({
      ...sellerState,
      isLoggedIn: true,
      phoneNumber: phone,
      shopName: 'Fresh Vegetables Store',
      location: 'Sector 15, Market Road',
      approvalStatus: 'APPROVED', // Change to 'PENDING' to see approval screen
      stockConfirmedToday: false, // Change to true to skip stock confirmation
    });
  };

  const handleLogout = () => {
    setSellerState({
      isLoggedIn: false,
      approvalStatus: 'PENDING',
      stockConfirmedToday: false,
      shopName: '',
      phoneNumber: '',
      location: '',
    });
    setCurrentScreen('login');
  };

  const handleStockConfirmed = () => {
    setSellerState({
      ...sellerState,
      stockConfirmedToday: true,
    });
    setCurrentScreen('dashboard');
  };

  const activeScreen = getActiveScreen();
  const showSidebar = sellerState.isLoggedIn && 
                     sellerState.approvalStatus === 'APPROVED' && 
                     sellerState.stockConfirmedToday;

  const renderScreen = () => {
    switch (activeScreen) {
      case 'login':
        return <SellerLogin onLogin={handleLogin} />;
      case 'approval':
        return <ApprovalStatus sellerState={sellerState} onLogout={handleLogout} />;
      case 'stock-confirmation':
        return <DailyStockConfirmation onConfirm={handleStockConfirmed} onLogout={handleLogout} />;
      case 'dashboard':
        return <SellerDashboard onNavigate={setCurrentScreen} />;
      case 'products':
        return <ProductsManagement />;
      case 'stock':
        return <StockManagement />;
      case 'orders':
        return <Orders />;
      case 'earnings':
        return <Earnings />;
      case 'warnings':
        return <WarningsCompliance />;
      case 'profile':
        return <Profile sellerState={sellerState} onLogout={handleLogout} />;
      default:
        return <SellerDashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar ? (
        <div className="flex">
          <Sidebar 
            currentScreen={currentScreen} 
            onNavigate={setCurrentScreen}
            shopName={sellerState.shopName}
          />
          <main className="flex-1 ml-64">
            {renderScreen()}
          </main>
        </div>
      ) : (
        <main className="w-full">
          {renderScreen()}
        </main>
      )}
    </div>
  );
}

export default App;
