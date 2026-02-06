import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Package, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import api from '../../utils/api';

export default function DeliveryActiveOrder() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [success, setSuccess] = useState(false);
  const [earning, setEarning] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/delivery/active-order').then(r => {
      if (r.data.order) setOrder(r.data.order);
      else navigate('/delivery/availability');
      setLoading(false);
    }).catch(() => { setLoading(false); navigate('/delivery/availability'); });
  }, [navigate]);

  const handlePickup = async () => {
    try {
      await api.post(`/api/delivery/orders/${order.id}/pickup`);
      setOrder({ ...order, status: 'OUT_FOR_DELIVERY' });
    } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { setOtpError('Please enter 6-digit OTP'); return; }
    setVerifying(true); setOtpError('');
    try {
      const res = await api.post(`/api/delivery/orders/${order.id}/verify-otp`, { otp });
      setSuccess(true);
      setEarning(res.data.delivery_earning || 0);
    } catch (err) { setOtpError(err.response?.data?.detail || 'Invalid OTP'); }
    setVerifying(false);
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" data-testid="delivery-success-screen">
        <div className="bg-white rounded-xl border p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-12 h-12 text-green-600" /></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Completed!</h1>
          <p className="text-gray-500 mb-4">Order {order?.id} has been delivered</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"><p className="text-sm text-green-800">Earning: <span className="font-bold">₹{earning}</span></p></div>
          <Button data-testid="back-to-availability-btn" onClick={() => navigate('/delivery/availability')} className="w-full bg-blue-600 hover:bg-blue-700">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="delivery-active-order-screen">
      <div className="bg-white border-b p-4"><div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-gray-900">Active Order</h1><p className="text-sm text-gray-500">{order.id}</p></div><Badge className={order.status === 'READY_FOR_PICKUP' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}>{order.status === 'READY_FOR_PICKUP' ? 'Pickup' : 'Delivering'}</Badge></div></div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-600" />Pickup Location</h3>
          <p className="text-sm text-gray-600">{order.seller_info?.address || 'Seller Address'}</p>
          {order.seller_info?.phone && <p className="text-sm text-gray-500 mt-1 flex items-center gap-2"><Phone className="w-4 h-4" />{order.seller_info.phone}</p>}
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-600" />Drop Location</h3>
          <p className="text-sm text-gray-600">{order.customer_address?.area || order.delivery_address?.area || 'Customer Address'}, {order.customer_address?.city || order.delivery_address?.city || ''}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Package className="w-5 h-5" />Items ({(order.items || []).length})</h3>
          <div className="space-y-2">{(order.items || []).map((item, i) => <div key={i} className="flex justify-between text-sm py-1"><span className="text-gray-600">{item.name} x {item.quantity}</span><span className="font-medium text-gray-900">₹{item.total || item.price * item.quantity}</span></div>)}</div>
          <div className="mt-3 pt-3 border-t flex justify-between font-bold text-gray-900"><span>Total (COD)</span><span>₹{order.total_amount}</span></div>
        </div>

        {order.status === 'READY_FOR_PICKUP' && (
          <Button data-testid="start-pickup-btn" onClick={handlePickup} className="w-full bg-blue-600 hover:bg-blue-700" size="lg"><span>Picked Up - Start Delivery</span><ArrowRight className="w-5 h-5 ml-2" /></Button>
        )}

        {order.status === 'OUT_FOR_DELIVERY' && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Verify Delivery OTP</h3>
            <p className="text-sm text-gray-500 mb-4">Ask customer for 6-digit OTP to confirm delivery</p>
            <div className="space-y-4">
              <div><Label>Enter OTP</Label><Input data-testid="delivery-otp-input" type="text" placeholder="Enter 6-digit OTP from customer" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} className="mt-2" /><p className="text-xs text-gray-400 mt-1">Dev mode: use 123456</p></div>
              {otpError && <p className="text-sm text-red-600">{otpError}</p>}
              <Button data-testid="confirm-delivery-btn" onClick={handleVerifyOTP} disabled={verifying || otp.length !== 6} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                {verifying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Confirm Delivery'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
