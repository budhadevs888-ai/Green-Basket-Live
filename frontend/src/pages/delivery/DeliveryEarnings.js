import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function DeliveryEarnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { api.get('/api/delivery/earnings').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  const d = data || { total: 0, paid: 0, pending: 0, transactions: [] };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="delivery-earnings-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/delivery/availability')}><ArrowLeft className="w-5 h-5" /></Button><h1 className="text-xl font-bold">My Earnings</h1></div>
      <div className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold text-gray-900">₹{d.total}</p></div>
          <div className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">Paid</p><p className="text-xl font-bold text-green-600">₹{d.paid}</p></div>
          <div className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">Pending</p><p className="text-xl font-bold text-amber-600">₹{d.pending}</p></div>
        </div>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-4 py-3 border-b"><h3 className="font-semibold text-gray-900">Transactions</h3></div>
          <div className="divide-y divide-gray-200">
            {d.transactions.length === 0 ? <div className="p-8 text-center text-gray-500">No earnings yet</div> : d.transactions.map(t => (
              <div key={t.id} className="p-4 flex justify-between items-center">
                <div><p className="text-sm font-medium text-gray-900">{t.order_id}</p><p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()}</p></div>
                <div className="flex items-center gap-2"><span className="font-semibold">₹{t.amount}</span>{t.status === 'PAID' ? <Badge className="bg-green-100 text-green-800">Paid</Badge> : <Badge className="bg-amber-100 text-amber-800">Pending</Badge>}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
