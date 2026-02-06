import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import api from '../../utils/api';

export default function AdminEarnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => { api.get(`/api/admin/earnings?role=${tab}`).then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); }, [tab]);

  const d = data || { total: 0, paid: 0, pending: 0, earnings: [] };

  return (
    <div className="p-6" data-testid="admin-earnings-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1><p className="text-sm text-gray-500 mt-1">Read-only earnings ledger</p></div>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-6"><p className="text-sm text-gray-500 mb-1">Total Earned</p><p className="text-3xl font-bold text-gray-900">₹{d.total}</p></div>
        <div className="bg-white rounded-xl border p-6"><p className="text-sm text-gray-500 mb-1">Paid</p><p className="text-3xl font-bold text-green-600">₹{d.paid}</p></div>
        <div className="bg-white rounded-xl border p-6"><p className="text-sm text-gray-500 mb-1">Pending</p><p className="text-3xl font-bold text-amber-600">₹{d.pending}</p></div>
      </div>
      <Tabs defaultValue="all" onValueChange={setTab}>
        <TabsList className="mb-6"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="seller">Sellers</TabsTrigger><TabsTrigger value="delivery">Delivery</TabsTrigger></TabsList>
        {['all', 'seller', 'delivery'].map(t => (
          <TabsContent key={t} value={t}>
            {loading ? <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div> : (
              <div className="bg-white rounded-xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="text-left px-6 py-4 text-sm font-semibold">Order ID</th><th className="text-left px-6 py-4 text-sm font-semibold">Role</th><th className="text-right px-6 py-4 text-sm font-semibold">Amount</th><th className="text-left px-6 py-4 text-sm font-semibold">Status</th><th className="text-left px-6 py-4 text-sm font-semibold">Date</th></tr></thead>
                <tbody className="divide-y">{d.earnings.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">No earnings</td></tr> : d.earnings.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium">{e.order_id}</td><td className="px-6 py-4"><Badge className={e.role === 'SELLER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>{e.role}</Badge></td><td className="px-6 py-4 text-sm text-right font-semibold">₹{e.amount}</td><td className="px-6 py-4"><Badge className={e.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>{e.status}</Badge></td><td className="px-6 py-4 text-sm text-gray-500">{new Date(e.created_at).toLocaleString()}</td></tr>
                ))}</tbody></table></div></div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
