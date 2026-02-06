import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Power, MapPin, Package, DollarSign, History, User, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import api from '../../utils/api';

export default function DeliveryAvailability() {
  const [available, setAvailable] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkOrder = useCallback(async () => {
    try {
      const res = await api.get('/api/delivery/active-order');
      if (res.data.order) setActiveOrder(res.data.order);
    } catch {}
  }, []);

  useEffect(() => {
    api.get('/api/delivery/profile').then(r => {
      setAvailable(r.data.is_available || false);
      setLoading(false);
    }).catch(() => setLoading(false));
    checkOrder();
    const interval = setInterval(checkOrder, 5000);
    return () => clearInterval(interval);
  }, [checkOrder]);

  const toggleAvailability = async (val) => {
    try {
      await api.post('/api/delivery/availability', { is_available: val });
      setAvailable(val);
    } catch {}
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (activeOrder) {
    navigate('/delivery/active-order');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20" data-testid="delivery-availability-screen">
      <div className="bg-white border-b p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><Truck className="w-6 h-6 text-white" /></div><div><h1 className="text-xl font-bold text-gray-900">Delivery Dashboard</h1><Badge className={available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>{available ? 'Online' : 'Offline'}</Badge></div></div></div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><Power className={`w-6 h-6 ${available ? 'text-green-600' : 'text-gray-400'}`} /><div><h2 className="font-semibold text-gray-900">Availability</h2><p className="text-sm text-gray-500">{available ? 'You are accepting orders' : 'Toggle to start accepting orders'}</p></div></div>
            <Switch data-testid="availability-toggle" checked={available} onCheckedChange={toggleAvailability} />
          </div>
          {available && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4"><div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-blue-900">Location tracking active</p><p className="text-sm text-blue-700 mt-1">Waiting for order assignment...</p></div></div></div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button onClick={() => navigate('/delivery/earnings')} variant="outline" className="justify-start gap-3 p-4 h-auto"><DollarSign className="w-5 h-5 text-green-600" /><span>My Earnings</span></Button>
          <Button onClick={() => navigate('/delivery/history')} variant="outline" className="justify-start gap-3 p-4 h-auto"><History className="w-5 h-5 text-blue-600" /><span>Delivery History</span></Button>
          <Button onClick={() => navigate('/delivery/profile')} variant="outline" className="justify-start gap-3 p-4 h-auto"><User className="w-5 h-5 text-gray-600" /><span>My Profile</span></Button>
        </div>
      </div>
    </div>
  );
}
