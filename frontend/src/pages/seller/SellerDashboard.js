import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/seller/dashboard').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const d = data || { today_orders: {}, stock_health: {}, earnings: {}, warnings_count: 0 };

  return (
    <div className="p-6" data-testid="seller-dashboard">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div onClick={() => navigate('/seller/orders')} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:border-green-300 hover:shadow-md transition-all" data-testid="dashboard-orders-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg"><ShoppingCart className="w-5 h-5 text-green-600" /></div>
            <h3 className="font-semibold text-gray-900">Today's Orders</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><span className="text-sm text-gray-600">Assigned</span></div>
              <span className="text-2xl font-bold text-gray-900">{d.today_orders.assigned || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm text-gray-600">Accepted</span></div>
              <span className="text-2xl font-bold text-gray-900">{d.today_orders.accepted || 0}</span>
            </div>
          </div>
        </div>

        <div onClick={() => navigate('/seller/stock')} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:border-green-300 hover:shadow-md transition-all" data-testid="dashboard-stock-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg"><Package className="w-5 h-5 text-green-600" /></div>
            <h3 className="font-semibold text-gray-900">Stock Health</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Healthy</span><span className="text-2xl font-bold text-green-600">{d.stock_health.healthy || 0}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Low Stock</span><span className="text-2xl font-bold text-amber-600">{d.stock_health.low || 0}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Out of Stock</span><span className="text-2xl font-bold text-red-600">{d.stock_health.out_of_stock || 0}</span></div>
          </div>
        </div>

        <div onClick={() => navigate('/seller/earnings')} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:border-green-300 hover:shadow-md transition-all" data-testid="dashboard-earnings-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
            <h3 className="font-semibold text-gray-900">Earnings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Today's Earnings</div>
              <div className="text-3xl font-bold text-gray-900">₹{d.earnings.today || 0}</div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Pending</span><span className="font-semibold text-gray-900">₹{d.earnings.pending || 0}</span></div>
            </div>
          </div>
        </div>

        <div onClick={() => navigate('/seller/warnings')} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:border-green-300 hover:shadow-md transition-all" data-testid="dashboard-compliance-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-green-600" /></div>
            <h3 className="font-semibold text-gray-900">Compliance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Active Warnings</span><span className="text-2xl font-bold text-amber-600">{d.warnings_count || 0}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/seller/products')} className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors" data-testid="quick-action-products">
            <Package className="w-5 h-5 text-green-600 mb-2" /><div className="font-medium text-gray-900">Manage Products</div><div className="text-sm text-gray-500 mt-1">Add or update products</div>
          </button>
          <button onClick={() => navigate('/seller/orders')} className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors" data-testid="quick-action-orders">
            <ShoppingCart className="w-5 h-5 text-green-600 mb-2" /><div className="font-medium text-gray-900">View Orders</div><div className="text-sm text-gray-500 mt-1">Process pending orders</div>
          </button>
          <button onClick={() => navigate('/seller/stock')} className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors" data-testid="quick-action-stock">
            <TrendingUp className="w-5 h-5 text-green-600 mb-2" /><div className="font-medium text-gray-900">Update Stock</div><div className="text-sm text-gray-500 mt-1">Adjust inventory levels</div>
          </button>
        </div>
      </div>
    </div>
  );
}
