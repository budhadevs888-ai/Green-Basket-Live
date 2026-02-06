import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import api from '../../utils/api';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/api/seller/orders').then(r => { setOrders(r.data.orders || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  // Real-time polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (orderId) => {
    try { await api.post(`/api/seller/orders/${orderId}/accept`); fetchOrders(); } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
  };

  const handleMarkReady = async (orderId) => {
    try { await api.post(`/api/seller/orders/${orderId}/ready`); fetchOrders(); } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
  };

  const getStatusBadge = (status) => {
    const map = {
      ASSIGNED: <Badge className="bg-blue-100 text-blue-800 border-blue-200">Assigned</Badge>,
      ACCEPTED: <Badge className="bg-amber-100 text-amber-800 border-amber-200">Accepted</Badge>,
      READY_FOR_PICKUP: <Badge className="bg-green-100 text-green-800 border-green-200">Ready</Badge>,
    };
    return map[status] || <Badge>{status}</Badge>;
  };

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const assigned = orders.filter(o => o.status === 'ASSIGNED');
  const accepted = orders.filter(o => o.status === 'ACCEPTED');
  const ready = orders.filter(o => o.status === 'READY_FOR_PICKUP');

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-green-300 transition-colors" data-testid={`order-card-${order.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3"><h3 className="font-semibold text-gray-900">{order.id}</h3>{getStatusBadge(order.status)}</div>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500"><Clock className="w-4 h-4" /><span>{new Date(order.created_at).toLocaleTimeString()}</span></div>
        </div>
        <div className="text-right"><div className="text-sm text-gray-500">Total</div><div className="text-xl font-bold text-gray-900">₹{order.total_amount}</div></div>
      </div>
      <div className="space-y-2 mb-4">
        {(order.items || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-900">{item.name}</span><span className="text-sm text-gray-500">({item.unit})</span></div>
            <div className="text-sm text-gray-600">{item.quantity} x ₹{item.price}</div>
          </div>
        ))}
      </div>
      {order.delivery_address && (
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg mb-4"><MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-700">{order.delivery_address.area || order.delivery_address.address || 'N/A'}</span></div>
      )}
      <div className="flex gap-2">
        {order.status === 'ASSIGNED' && <Button onClick={() => handleAccept(order.id)} className="flex-1 bg-green-600 hover:bg-green-700" data-testid={`accept-order-${order.id}`}>Accept Order</Button>}
        {order.status === 'ACCEPTED' && <Button onClick={() => handleMarkReady(order.id)} className="flex-1 bg-green-600 hover:bg-green-700" data-testid={`ready-order-${order.id}`}>Mark as Ready</Button>}
        {order.status === 'READY_FOR_PICKUP' && <div className="flex-1 text-center py-2 text-sm text-gray-500">Waiting for pickup</div>}
      </div>
    </div>
  );

  const EmptyState = () => <div className="bg-white rounded-lg border border-gray-200 p-12 text-center"><Package className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No orders</p></div>;

  return (
    <div className="p-6" data-testid="seller-orders-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Orders</h1><p className="text-sm text-gray-500 mt-1">Manage and fulfill your orders</p></div>
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="assigned" data-testid="orders-tab-assigned">Assigned ({assigned.length})</TabsTrigger>
          <TabsTrigger value="accepted" data-testid="orders-tab-accepted">Accepted ({accepted.length})</TabsTrigger>
          <TabsTrigger value="ready" data-testid="orders-tab-ready">Ready ({ready.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">{assigned.length > 0 ? <div className="grid gap-4">{assigned.map(o => <OrderCard key={o.id} order={o} />)}</div> : <EmptyState />}</TabsContent>
        <TabsContent value="accepted">{accepted.length > 0 ? <div className="grid gap-4">{accepted.map(o => <OrderCard key={o.id} order={o} />)}</div> : <EmptyState />}</TabsContent>
        <TabsContent value="ready">{ready.length > 0 ? <div className="grid gap-4">{ready.map(o => <OrderCard key={o.id} order={o} />)}</div> : <EmptyState />}</TabsContent>
      </Tabs>
    </div>
  );
}
