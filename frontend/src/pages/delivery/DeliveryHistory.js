import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import api from '../../utils/api';

export default function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { api.get('/api/delivery/history').then(r => { setDeliveries(r.data.deliveries || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="delivery-history-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/delivery/availability')}><ArrowLeft className="w-5 h-5" /></Button><h1 className="text-xl font-bold">Delivery History</h1></div>
      <div className="flex-1 p-4">
        {loading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div> : deliveries.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center"><Package className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No deliveries yet</p></div>
        ) : (
          <div className="space-y-3">{deliveries.map(d => (
            <div key={d.id} className="bg-white rounded-xl border p-4">
              <div className="flex justify-between items-start mb-2"><p className="font-semibold text-gray-900">{d.id}</p><p className="font-bold text-gray-900">₹{d.total_amount}</p></div>
              <p className="text-sm text-gray-500">{new Date(d.updated_at).toLocaleString()}</p>
              <p className="text-sm text-gray-500">{(d.items || []).length} items</p>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
