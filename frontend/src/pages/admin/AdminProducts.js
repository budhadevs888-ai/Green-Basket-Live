import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import api from '../../utils/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => { api.get('/api/admin/products').then(r => { setProducts(r.data.products || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchProducts(); }, []);

  const handleApprove = async (id) => { try { await api.post(`/api/admin/products/${id}/approve`); fetchProducts(); } catch {} };
  const handleReject = async (id) => { try { await api.post(`/api/admin/products/${id}/reject`); fetchProducts(); } catch {} };

  const pending = products.filter(p => p.status === 'PENDING');
  const approved = products.filter(p => p.status === 'APPROVED');
  const rejected = products.filter(p => p.status === 'REJECTED');

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  const getStatusBadge = (status) => {
    const map = { APPROVED: 'bg-green-100 text-green-700', PENDING: 'bg-amber-100 text-amber-700', REJECTED: 'bg-red-100 text-red-700' };
    return <Badge className={map[status] || 'bg-gray-100 text-gray-700'}>{status}</Badge>;
  };

  const ProductTable = ({ list, showActions }) => (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold">Product Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold">Unit</th>
              <th className="text-right px-6 py-4 text-sm font-semibold">Price</th>
              <th className="text-center px-6 py-4 text-sm font-semibold">Stock</th>
              <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
              {showActions && <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.length === 0 ? (
              <tr><td colSpan={showActions ? 7 : 6} className="p-8 text-center text-gray-500">No products</td></tr>
            ) : list.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.unit}</td>
                <td className="px-6 py-4 text-sm text-right font-medium">₹{p.seller_price}</td>
                <td className="px-6 py-4 text-sm text-center">{p.stock || 0}</td>
                <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                {showActions && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(p.id)} className="bg-green-600 hover:bg-green-700" data-testid={`approve-product-${p.id}`}>
                        <CheckCircle className="w-4 h-4 mr-1" />Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(p.id)} data-testid={`reject-product-${p.id}`}>
                        <XCircle className="w-4 h-4 mr-1" />Reject
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6" data-testid="admin-products-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Approval</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve seller products</p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">{products.length} total products</span>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending" data-testid="products-tab-pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved" data-testid="products-tab-approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected" data-testid="products-tab-rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending"><ProductTable list={pending} showActions={true} /></TabsContent>
        <TabsContent value="approved"><ProductTable list={approved} showActions={false} /></TabsContent>
        <TabsContent value="rejected"><ProductTable list={rejected} showActions={false} /></TabsContent>
      </Tabs>
    </div>
  );
}
