import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, Store, Truck, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  const roles = [
    { label: 'Customer', description: 'Browse products and place orders', icon: ShoppingBasket, path: '/customer/login', color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Seller', description: 'Manage products and fulfill orders', icon: Store, path: '/seller/login', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { label: 'Delivery Partner', description: 'Deliver orders and earn', icon: Truck, path: '/delivery/login', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Admin', description: 'System administration', icon: Shield, path: '/admin/login', color: 'bg-slate-700 hover:bg-slate-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col" data-testid="landing-page">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-3xl mb-6 shadow-lg shadow-green-200">
              <ShoppingBasket className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Green Basket</h1>
            <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">Your neighborhood marketplace for daily essentials. Fresh products delivered to your doorstep.</p>
          </div>
          <div className="space-y-4">
            {roles.map(role => {
              const Icon = role.icon;
              return (
                <Button key={role.label} onClick={() => navigate(role.path)} className={`w-full h-auto py-5 px-6 ${role.color} text-white`} data-testid={`landing-${role.label.toLowerCase().replace(/\s+/g, '-')}-btn`}>
                  <div className="flex items-center gap-4 w-full text-left">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-6 h-6 text-white" /></div>
                    <div><div className="font-semibold text-base">{role.label}</div><div className="text-sm opacity-80 mt-0.5">{role.description}</div></div>
                  </div>
                </Button>
              );
            })}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">Green Basket v1.0 — Single City Delivery</p>
        </div>
      </div>
    </div>
  );
}
