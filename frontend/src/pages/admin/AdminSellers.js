import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Ban, Loader2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import api from '../../utils/api';

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);

  const fetchSellers = () => { api.get('/api/admin/sellers').then(r => { setSellers(r.data.sellers || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchSellers(); }, []);

  const handleApprove = async (id) => { try { await api.post(`/api/admin/sellers/${id}/approve`); fetchSellers(); } catch {} };
  const handleReject = async () => { if (!rejectReason.trim()) return; try { await api.post(`/api/admin/sellers/${rejectTarget}/reject`, { reason: rejectReason }); setRejectDialog(false); setRejectReason(''); fetchSellers(); } catch {} };
  const handleSuspend = async (id) => { try { await api.post(`/api/admin/sellers/${id}/suspend`, { reason: 'Admin action' }); fetchSellers(); } catch {} };

  const pending = sellers.filter(s => s.approval_status === 'PENDING');
  const approved = sellers.filter(s => s.approval_status === 'APPROVED');
  const suspended = sellers.filter(s => s.approval_status === 'SUSPENDED' || s.status === 'SUSPENDED');

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  const SellerTable = ({ list, showActions }) => (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left px-6 py-4 text-sm font-semibold">Phone</th><th className="text-left px-6 py-4 text-sm font-semibold">Shop Name</th><th className="text-left px-6 py-4 text-sm font-semibold">City</th><th className="text-left px-6 py-4 text-sm font-semibold">Status</th><th className="text-left px-6 py-4 text-sm font-semibold">Actions</th></tr></thead>
          <tbody className="divide-y">{list.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">No sellers</td></tr> : list.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{s.phone}</td><td className="px-6 py-4 text-sm font-medium">{s.shop_name || 'N/A'}</td><td className="px-6 py-4 text-sm">{s.city || 'N/A'}</td>
              <td className="px-6 py-4"><Badge className={s.approval_status === 'APPROVED' ? 'bg-green-100 text-green-700' : s.approval_status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>{s.approval_status}</Badge></td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSeller(s)} data-testid={`view-seller-${s.id}`}><Eye className="w-4 h-4" /></Button>
                  {showActions === 'pending' && <><Button size="sm" onClick={() => handleApprove(s.id)} className="bg-green-600 hover:bg-green-700" data-testid={`approve-seller-${s.id}`}><CheckCircle className="w-4 h-4 mr-1" />Approve</Button><Button size="sm" variant="destructive" onClick={() => { setRejectTarget(s.id); setRejectDialog(true); }} data-testid={`reject-seller-${s.id}`}><XCircle className="w-4 h-4 mr-1" />Reject</Button></>}
                  {showActions === 'approved' && <Button size="sm" variant="outline" onClick={() => handleSuspend(s.id)} className="text-red-600" data-testid={`suspend-seller-${s.id}`}><Ban className="w-4 h-4 mr-1" />Suspend</Button>}
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6" data-testid="admin-sellers-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Seller Management</h1></div>
      <Tabs defaultValue="pending">
        <TabsList className="mb-6"><TabsTrigger value="pending" data-testid="sellers-tab-pending">Pending ({pending.length})</TabsTrigger><TabsTrigger value="approved" data-testid="sellers-tab-approved">Approved ({approved.length})</TabsTrigger><TabsTrigger value="suspended" data-testid="sellers-tab-suspended">Suspended ({suspended.length})</TabsTrigger></TabsList>
        <TabsContent value="pending"><SellerTable list={pending} showActions="pending" /></TabsContent>
        <TabsContent value="approved"><SellerTable list={approved} showActions="approved" /></TabsContent>
        <TabsContent value="suspended"><SellerTable list={suspended} showActions="suspended" /></TabsContent>
      </Tabs>

      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent><DialogHeader><DialogTitle>Reject Seller</DialogTitle><DialogDescription>Provide a reason for rejection</DialogDescription></DialogHeader>
          <div className="space-y-4"><div><Label>Reason</Label><Input data-testid="reject-reason-input" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter rejection reason" className="mt-2" /></div>
            <div className="flex gap-2"><Button onClick={handleReject} disabled={!rejectReason.trim()} className="flex-1 bg-red-600 hover:bg-red-700" data-testid="confirm-reject-btn">Confirm Reject</Button><Button variant="outline" onClick={() => setRejectDialog(false)} className="flex-1">Cancel</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
        <DialogContent><DialogHeader><DialogTitle>Seller Details</DialogTitle></DialogHeader>
          {selectedSeller && <div className="space-y-3">
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-gray-500">Phone</span><span className="text-sm font-medium">{selectedSeller.phone}</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-gray-500">Shop Name</span><span className="text-sm font-medium">{selectedSeller.shop_name || 'N/A'}</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-gray-500">City</span><span className="text-sm font-medium">{selectedSeller.city || 'N/A'}</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-gray-500">Address</span><span className="text-sm font-medium">{selectedSeller.address || 'N/A'}</span></div>
            <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Status</span><Badge className="bg-amber-100 text-amber-700">{selectedSeller.approval_status}</Badge></div>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
