import React, { useState, useEffect } from 'react';
import { CheckCircle, Ban, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import api from '../../utils/api';

export default function AdminDeliveryPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { api.get('/api/admin/delivery-partners').then(r => { setPartners(r.data.delivery_partners || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id) => { try { await api.post(`/api/admin/delivery-partners/${id}/approve`); fetch(); } catch {} };
  const handleSuspend = async (id) => { try { await api.post(`/api/admin/delivery-partners/${id}/suspend`, { reason: 'Admin action' }); fetch(); } catch {} };

  const pending = partners.filter(p => p.approval_status === 'PENDING');
  const approved = partners.filter(p => p.approval_status === 'APPROVED');
  const suspended = partners.filter(p => p.approval_status === 'SUSPENDED' || p.status === 'SUSPENDED');

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  const Table = ({ list, type }) => (
    <div className="bg-white rounded-xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="text-left px-6 py-4 text-sm font-semibold">Phone</th><th className="text-left px-6 py-4 text-sm font-semibold">City</th><th className="text-left px-6 py-4 text-sm font-semibold">Available</th><th className="text-left px-6 py-4 text-sm font-semibold">Status</th><th className="text-left px-6 py-4 text-sm font-semibold">Actions</th></tr></thead>
      <tbody className="divide-y">{list.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">No partners</td></tr> : list.map(p => (
        <tr key={p.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm">{p.phone}</td><td className="px-6 py-4 text-sm">{p.city || 'N/A'}</td><td className="px-6 py-4"><Badge className={p.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>{p.is_available ? 'Yes' : 'No'}</Badge></td><td className="px-6 py-4"><Badge className={p.approval_status === 'APPROVED' ? 'bg-green-100 text-green-700' : p.approval_status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>{p.approval_status}</Badge></td>
          <td className="px-6 py-4"><div className="flex gap-2">{type === 'pending' && <Button size="sm" onClick={() => handleApprove(p.id)} className="bg-green-600 hover:bg-green-700" data-testid={`approve-delivery-${p.id}`}><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>}{type === 'approved' && <Button size="sm" variant="outline" onClick={() => handleSuspend(p.id)} className="text-red-600" data-testid={`suspend-delivery-${p.id}`}><Ban className="w-4 h-4 mr-1" />Suspend</Button>}</div></td>
        </tr>))}</tbody></table></div></div>
  );

  return (
    <div className="p-6" data-testid="admin-delivery-partners-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Delivery Partner Management</h1></div>
      <Tabs defaultValue="pending"><TabsList className="mb-6"><TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger><TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger><TabsTrigger value="suspended">Suspended ({suspended.length})</TabsTrigger></TabsList>
        <TabsContent value="pending"><Table list={pending} type="pending" /></TabsContent><TabsContent value="approved"><Table list={approved} type="approved" /></TabsContent><TabsContent value="suspended"><Table list={suspended} type="suspended" /></TabsContent>
      </Tabs>
    </div>
  );
}
