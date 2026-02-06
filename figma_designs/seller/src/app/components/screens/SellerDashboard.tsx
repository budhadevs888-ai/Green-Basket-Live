import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}

function DashboardCard({ title, icon, onClick, children }: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-6 ${
        onClick ? 'cursor-pointer hover:border-green-300 hover:shadow-md transition-all' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-50 rounded-lg">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

interface SellerDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function SellerDashboard({ onNavigate }: SellerDashboardProps) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Orders */}
        <DashboardCard
          title="Today's Orders"
          icon={<ShoppingCart className="w-5 h-5 text-green-600" />}
          onClick={() => onNavigate('orders')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-600">Assigned</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">8</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Accepted</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">12</span>
            </div>
          </div>
        </DashboardCard>

        {/* Stock Health */}
        <DashboardCard
          title="Stock Health"
          icon={<Package className="w-5 h-5 text-green-600" />}
          onClick={() => onNavigate('stock')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Healthy</span>
              <span className="text-2xl font-bold text-green-600">15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Stock</span>
              <span className="text-2xl font-bold text-amber-600">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Out of Stock</span>
              <span className="text-2xl font-bold text-red-600">1</span>
            </div>
          </div>
        </DashboardCard>

        {/* Earnings */}
        <DashboardCard
          title="Earnings"
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          onClick={() => onNavigate('earnings')}
        >
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Today's Earnings</div>
              <div className="text-3xl font-bold text-gray-900">₹2,450</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+12% from yesterday</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-gray-900">₹8,300</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Compliance */}
        <DashboardCard
          title="Compliance"
          icon={<AlertTriangle className="w-5 h-5 text-green-600" />}
          onClick={() => onNavigate('warnings')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Warnings</span>
              <span className="text-2xl font-bold text-amber-600">1</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900 font-medium">
                Late stock confirmation (Feb 4)
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Ensure daily stock is confirmed by 9 AM
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('products')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <Package className="w-5 h-5 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Manage Products</div>
            <div className="text-sm text-gray-500 mt-1">Add or update products</div>
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">View Orders</div>
            <div className="text-sm text-gray-500 mt-1">Process pending orders</div>
          </button>
          <button
            onClick={() => onNavigate('stock')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Update Stock</div>
            <div className="text-sm text-gray-500 mt-1">Adjust inventory levels</div>
          </button>
        </div>
      </div>
    </div>
  );
}
