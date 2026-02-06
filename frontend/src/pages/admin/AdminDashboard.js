import React, { useState, useEffect } from 'react';
import { ShoppingCart, Store, Truck, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/api/admin/dashboard').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  const d = data || {};

  const metrics = [
    { label: "Today's Orders", value: d.total_orders_today || 0, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Orders', value: d.active_orders || 0, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Delivered', value: d.delivered_orders || 0, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Active Sellers', value: d.active_sellers || 0, icon: Store, color: 'bg-purple-50 text-purple-600' },
    { label: 'Active Delivery', value: d.active_delivery_partners || 0, icon: Truck, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Pending Approvals', value: d.pending_approvals || 0, icon: AlertCircle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="p-6" data-testid="admin-dashboard">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1><p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {metrics.map(m => { const Icon = m.icon; return (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow" data-testid={`admin-metric-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex items-center gap-3 mb-3"><div className={`p-2 rounded-lg ${m.color}`}><Icon className="w-5 h-5" /></div><span className="text-sm text-gray-600">{m.label}</span></div>
            <div className="text-3xl font-bold text-gray-900">{m.value}</div>
          </div>
        ); })}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200"><h2 className="font-semibold text-gray-900">Recent Activity</h2></div>
        <div className="divide-y divide-gray-200">
          {(d.recent_activity || []).length === 0 ? <div className="p-8 text-center text-gray-500">No recent activity</div> : (d.recent_activity || []).map((log, i) => (
            <div key={i} className="px-6 py-4 hover:bg-gray-50"><div className="flex justify-between items-start"><div className="flex-1"><p className="text-sm font-medium text-gray-900">{log.action}</p><p className="text-sm text-gray-500 mt-1">{log.details}</p></div><span className="text-xs text-gray-400 whitespace-nowrap ml-4">{new Date(log.created_at).toLocaleTimeString()}</span></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
