import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, Info, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function SellerEarnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/seller/earnings').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const d = data || { total: 0, paid: 0, pending: 0, transactions: [] };

  return (
    <div className="p-6" data-testid="seller-earnings-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Earnings</h1><p className="text-sm text-gray-500 mt-1">Track your financial transactions</p></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div><span className="text-sm text-gray-600">Total Earned</span></div>
          <div className="text-3xl font-bold text-gray-900">₹{d.total.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-green-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div><span className="text-sm text-gray-600">Paid</span></div>
          <div className="text-3xl font-bold text-green-600">₹{d.paid.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-amber-50 rounded-lg"><Clock className="w-5 h-5 text-amber-600" /></div><span className="text-sm text-gray-600">Pending</span></div>
          <div className="text-3xl font-bold text-amber-600">₹{d.pending.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900"><p><strong>Note:</strong> All payouts are handled by admin. Payments are typically processed weekly.</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200"><h2 className="font-semibold text-gray-900">Transaction History</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Order ID</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {d.transactions.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No earnings yet</td></tr>
              ) : d.transactions.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.order_id}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">₹{t.amount}</td>
                  <td className="px-6 py-4">
                    {t.status === 'PAID' ? <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>
                    : <Badge className="bg-amber-100 text-amber-800 border-amber-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
