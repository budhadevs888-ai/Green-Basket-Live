import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Package, Truck, Clock, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { api.get(`/api/customer/orders/${orderId}`).then(r => { setOrder(r.data.order); setLoading(false); }).catch(() => setLoading(false)); }, [orderId]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;
  if (!order) return <div className="min-h-screen bg-gray-50 flex flex-col"><div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/customer/orders')}><ArrowLeft className="w-5 h-5" /></Button><h1 className="text-xl font-bold">Order Not Found</h1></div></div>;

  const statusMap = { CREATED: 0, ASSIGNED: 1, ACCEPTED: 1, READY_FOR_PICKUP: 1, OUT_FOR_DELIVERY: 2, DELIVERED: 3 };
  const currentStep = statusMap[order.status] ?? 0;
  const steps = [
    { label: 'Order Placed', icon: CheckCircle },
    { label: 'Preparing', icon: Package },
    { label: 'Out for Delivery', icon: Truck },
    { label: 'Delivered', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="customer-order-tracking-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/customer/orders')}><ArrowLeft className="w-5 h-5" /></Button><div className="flex-1"><h1 className="text-xl font-bold">Track Order</h1><p className="text-sm text-gray-500">{order.id}</p></div></div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="bg-white rounded-xl border p-6">
          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const completed = i <= currentStep;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}><Icon className="w-5 h-5" /></div>
                    {i < steps.length - 1 && <div className={`w-0.5 h-12 my-1 ${completed ? 'bg-green-600' : 'bg-gray-200'}`} />}
                  </div>
                  <div className="flex-1 pt-2"><p className={`font-medium ${completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>{i === currentStep && <Badge className="mt-1 bg-green-100 text-green-700">Current Status</Badge>}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Order Items ({(order.items || []).length})</h3>
          <div className="space-y-3">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex justify-between items-center"><div><p className="text-sm font-medium text-gray-900">{item.name}</p><p className="text-xs text-gray-500">{item.unit} x {item.quantity}</p></div><p className="font-medium text-gray-900">₹{item.total || item.price * item.quantity}</p></div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between font-bold text-gray-900"><span>Total</span><span>₹{order.total_amount}</span></div>
        </div>
      </div>
      <div className="bg-white border-t p-4"><Button onClick={() => navigate('/customer/home')} variant="outline" className="w-full" size="lg">Continue Shopping</Button></div>
    </div>
  );
}
