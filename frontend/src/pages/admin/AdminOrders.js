import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import api from '../../utils/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/api/admin/orders').then(r => { setOrders(r.data.orders || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  const statuses = ['all', 'CREATED', 'ASSIGNED', 'ACCEPTED', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const getFiltered = (status) => status === 'all' ? orders : orders.filter(o => o.status === status);

  const getStatusBadge = (s) => {
    const map = { CREATED: 'bg-gray-100 text-gray-700', ASSIGNED: 'bg-blue-100 text-blue-700', ACCEPTED: 'bg-amber-100 text-amber-700', READY_FOR_PICKUP: 'bg-purple-100 text-purple-700', OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700' };
    return <Badge className={map[s] || 'bg-gray-100 text-gray-700'}>{s}</Badge>;
  };

  const OrderTable = ({ list }) => (
    <div className="bg-white rounded-xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="text-left px-6 py-4 text-sm font-semibold">Order ID</th><th className="text-left px-6 py-4 text-sm font-semibold">Items</th><th className="text-right px-6 py-4 text-sm font-semibold">Total</th><th className="text-left px-6 py-4 text-sm font-semibold">Status</th><th className="text-left px-6 py-4 text-sm font-semibold">Date</th></tr></thead>
      <tbody className="divide-y">{list.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">No orders</td></tr> : list.map(o => (
        <tr key={o.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium">{o.id}</td><td className="px-6 py-4 text-sm">{(o.items || []).length} items</td><td className="px-6 py-4 text-sm text-right font-semibold">₹{o.total_amount}</td><td className="px-6 py-4">{getStatusBadge(o.status)}</td><td className="px-6 py-4 text-sm text-gray-500">{new Date(o.created_at).toLocaleString()}</td></tr>
      ))}</tbody></table></div></div>
  );

  return (
    <div className="p-6" data-testid="admin-orders-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Order Monitoring</h1><p className="text-sm text-gray-500 mt-1">Read-only view of all orders</p></div>
      <Tabs defaultValue="all"><TabsList className="mb-6 flex-wrap">{statuses.map(s => <TabsTrigger key={s} value={s} data-testid={`orders-filter-${s}`}>{s === 'all' ? `All (${orders.length})` : `${s.replace(/_/g, ' ')} (${getFiltered(s).length})`}</TabsTrigger>)}</TabsList>
        {statuses.map(s => <TabsContent key={s} value={s}><OrderTable list={getFiltered(s)} /></TabsContent>)}
      </Tabs>
    </div>
  );
}
