import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Store, Truck, ShoppingCart, DollarSign, Users, ScrollText, User, Shield, Package } from 'lucide-react';

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/sellers', label: 'Sellers', icon: Store },
  { to: '/admin/delivery-partners', label: 'Delivery Partners', icon: Truck },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/earnings', label: 'Earnings', icon: DollarSign },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { to: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-layout">
      <div className="flex">
        <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col z-40">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center"><Shield className="w-6 h-6 text-white" /></div><div><div className="text-xs text-slate-500">Green Basket</div><div className="font-semibold text-white">Admin Panel</div></div></div>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink to={item.to} data-testid={`admin-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
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
