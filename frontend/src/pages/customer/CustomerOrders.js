import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { api.get('/api/customer/orders').then(r => { setOrders(r.data.orders || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const getStatusBadge = (status) => {
    const map = { CREATED: { label: 'Placed', cls: 'bg-blue-100 text-blue-700' }, ASSIGNED: { label: 'Preparing', cls: 'bg-amber-100 text-amber-700' }, ACCEPTED: { label: 'Preparing', cls: 'bg-amber-100 text-amber-700' }, READY_FOR_PICKUP: { label: 'Ready', cls: 'bg-purple-100 text-purple-700' }, OUT_FOR_DELIVERY: { label: 'Out for Delivery', cls: 'bg-orange-100 text-orange-700' }, DELIVERED: { label: 'Delivered', cls: 'bg-green-100 text-green-700' }, CANCELLED: { label: 'Cancelled', cls: 'bg-red-100 text-red-700' } };
    const s = map[status] || map.CREATED;
    return <Badge className={s.cls}>{s.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="customer-orders-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/customer/home')}><ArrowLeft className="w-5 h-5" /></Button><h1 className="text-xl font-bold">My Orders</h1></div>
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div> : orders.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]"><div className="bg-white rounded-xl border p-12 text-center max-w-md"><Package className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2><Button onClick={() => navigate('/customer/home')} className="bg-green-600 hover:bg-green-700">Start Shopping</Button></div></div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/customer/orders/${order.id}`)} data-testid={`customer-order-${order.id}`}>
                <div className="flex justify-between items-start mb-3"><div><p className="font-semibold text-gray-900">{order.id}</p><p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p></div>{getStatusBadge(order.status)}</div>
                <div className="flex justify-between items-center"><p className="text-sm text-gray-600">{(order.items || []).length} items</p><p className="font-bold text-gray-900">₹{order.total_amount}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white border-t p-3"><div className="flex justify-around max-w-2xl mx-auto"><Button variant="ghost" onClick={() => navigate('/customer/home')} className="flex-col h-auto gap-1"><span className="text-xs">Home</span></Button><Button variant="ghost" className="flex-col h-auto gap-1 text-green-600"><span className="text-xs">Orders</span></Button><Button variant="ghost" onClick={() => navigate('/customer/profile')} className="flex-col h-auto gap-1"><span className="text-xs">Profile</span></Button></div></div>
    </div>
  );
}
