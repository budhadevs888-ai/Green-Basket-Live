import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Archive, ShoppingCart, DollarSign, AlertTriangle, User, ShoppingBasket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/seller/products', label: 'Products', icon: Package },
  { to: '/seller/stock', label: 'Stock', icon: Archive },
  { to: '/seller/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/seller/earnings', label: 'Earnings', icon: DollarSign },
  { to: '/seller/warnings', label: 'Warnings', icon: AlertTriangle },
  { to: '/seller/profile', label: 'Profile', icon: User },
];

export default function SellerLayout() {
  const { getStoredUser } = useAuth();
  const user = getStoredUser();

  return (
    <div className="min-h-screen bg-gray-50" data-testid="seller-layout">
      <div className="flex">
        <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center"><ShoppingBasket className="w-6 h-6 text-white" /></div>
              <div><div className="text-sm text-gray-500">Green Basket</div><div className="font-semibold text-gray-900 truncate max-w-[140px]">{user?.shop_name || 'Seller Panel'}</div></div>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink to={item.to} data-testid={`seller-nav-${item.label.toLowerCase()}`}
                      className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                      <Icon className="w-5 h-5" /><span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <main className="flex-1 ml-64"><Outlet /></main>
      </div>
    </div>
  );
}
