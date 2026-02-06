import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import api from '../../utils/api';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkProducts, setBulkProducts] = useState([{ name: '', unit: '', price: '' }]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = () => {
    api.get('/api/seller/products').then(r => { setProducts(r.data.products || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handlePriceChange = async (id, newPrice) => {
    try {
      await api.patch(`/api/seller/products/${id}/price`, { price: Number(newPrice) });
      setProducts(products.map(p => p.id === id ? { ...p, seller_price: Number(newPrice) } : p));
    } catch {}
  };

  const addBulkRow = () => setBulkProducts([...bulkProducts, { name: '', unit: '', price: '' }]);

  const updateBulkRow = (index, field, value) => {
    const updated = [...bulkProducts];
    updated[index] = { ...updated[index], [field]: value };
    setBulkProducts(updated);
  };

  const removeBulkRow = (index) => setBulkProducts(bulkProducts.filter((_, i) => i !== index));

  const handleBulkSubmit = async () => {
    const valid = bulkProducts.filter(p => p.name && p.unit && p.price);
    if (valid.length === 0) return;
    setSubmitting(true);
    try {
      await api.post('/api/seller/products/bulk', { products: valid.map(p => ({ name: p.name, unit: p.unit, price: Number(p.price) })) });
      setIsDialogOpen(false);
      setBulkProducts([{ name: '', unit: '', price: '' }]);
      fetchProducts();
    } catch {}
    setSubmitting(false);
  };

  const getStatusBadge = (status) => {
    const map = {
      APPROVED: <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>,
      PENDING: <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>,
      REJECTED: <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>,
    };
    return map[status] || null;
  };

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="p-6" data-testid="seller-products-screen">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Products</h1><p className="text-sm text-gray-500 mt-1">Manage your product catalog</p></div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-products-bulk-btn" className="bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-2" />Add Products (Bulk)</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Products in Bulk</DialogTitle>
              <DialogDescription>Add multiple products at once. All products will be submitted for approval.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {bulkProducts.map((product, index) => (
                <div key={index} className="flex gap-3 items-start p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div><Label>Product Name</Label><Input placeholder="e.g., Tomatoes" value={product.name} onChange={(e) => updateBulkRow(index, 'name', e.target.value)} className="mt-1.5" data-testid={`bulk-product-name-${index}`} /></div>
                    <div><Label>Unit</Label><Input placeholder="e.g., 1kg" value={product.unit} onChange={(e) => updateBulkRow(index, 'unit', e.target.value)} className="mt-1.5" /></div>
                    <div><Label>Price</Label><Input type="number" placeholder="0" value={product.price} onChange={(e) => updateBulkRow(index, 'price', e.target.value)} className="mt-1.5" /></div>
                  </div>
                  {bulkProducts.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeBulkRow(index)} className="mt-7">Remove</Button>}
                </div>
              ))}
              <Button variant="outline" onClick={addBulkRow} className="w-full"><Plus className="w-4 h-4 mr-2" />Add Another Product</Button>
              <div className="flex gap-3 pt-4">
                <Button data-testid="submit-bulk-products-btn" onClick={handleBulkSubmit} disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Submit for Approval
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900"><p><strong>Note:</strong> All new products must be approved by admin before they can be sold. You cannot activate products yourself.</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Product Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Unit</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Your Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No products yet. Add products using the bulk add button.</td></tr>
              ) : products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.unit}</td>
                  <td className="px-6 py-4">
                    {product.status === 'APPROVED' ? (
                      <Input type="number" value={product.seller_price} onChange={(e) => handlePriceChange(product.id, e.target.value)} className="w-28" />
                    ) : (
                      <span className="text-sm text-gray-600">₹{product.seller_price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
