import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Archive, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle, 
  User,
  ShoppingBasket
} from 'lucide-react';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  shopName: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'stock', label: 'Stock', icon: Archive },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'warnings', label: 'Warnings', icon: AlertTriangle },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function Sidebar({ currentScreen, onNavigate, shopName }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo & Shop Name */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <ShoppingBasket className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Green Basket</div>
            <div className="font-semibold text-gray-900">{shopName}</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-green-50 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
