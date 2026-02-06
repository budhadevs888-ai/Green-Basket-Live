import React, { useState } from 'react';
import { Plus, Edit, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface Product {
  id: string;
  name: string;
  unit: string;
  sellerPrice: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Tomatoes', unit: '1kg', sellerPrice: 40, status: 'approved' },
    { id: '2', name: 'Onions', unit: '1kg', sellerPrice: 35, status: 'approved' },
    { id: '3', name: 'Potatoes', unit: '1kg', sellerPrice: 30, status: 'approved' },
    { id: '4', name: 'Carrots', unit: '500g', sellerPrice: 25, status: 'approved' },
    { id: '5', name: 'Spinach', unit: '250g', sellerPrice: 20, status: 'pending' },
    { id: '6', name: 'Cabbage', unit: '1pc', sellerPrice: 30, status: 'rejected' },
  ]);

  const [bulkProducts, setBulkProducts] = useState([
    { name: '', unit: '', price: '' }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePriceChange = (id: string, newPrice: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, sellerPrice: newPrice } : p
    ));
  };

  const addBulkRow = () => {
    setBulkProducts([...bulkProducts, { name: '', unit: '', price: '' }]);
  };

  const updateBulkRow = (index: number, field: string, value: string) => {
    const updated = [...bulkProducts];
    updated[index] = { ...updated[index], [field]: value };
    setBulkProducts(updated);
  };

  const removeBulkRow = (index: number) => {
    setBulkProducts(bulkProducts.filter((_, i) => i !== index));
  };

  const handleBulkSubmit = () => {
    // Mock submission
    console.log('Submitting bulk products:', bulkProducts);
    setIsDialogOpen(false);
    setBulkProducts([{ name: '', unit: '', price: '' }]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Products (Bulk)
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Products in Bulk</DialogTitle>
              <DialogDescription>
                Add multiple products at once. All products will be submitted for approval.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {bulkProducts.map((product, index) => (
                <div key={index} className="flex gap-3 items-start p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <Label>Product Name</Label>
                      <Input
                        placeholder="e.g., Tomatoes"
                        value={product.name}
                        onChange={(e) => updateBulkRow(index, 'name', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input
                        placeholder="e.g., 1kg"
                        value={product.unit}
                        onChange={(e) => updateBulkRow(index, 'unit', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={product.price}
                        onChange={(e) => updateBulkRow(index, 'price', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  {bulkProducts.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBulkRow(index)}
                      className="mt-7"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addBulkRow}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Product
              </Button>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleBulkSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Submit for Approval
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p><strong>Note:</strong> All new products must be approved by admin before they can be sold. 
          You cannot activate products yourself. Price changes on approved products take effect immediately.</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Product Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Unit</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Your Price (₹)</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'approved' ? (
                      <Input
                        type="number"
                        value={product.sellerPrice}
                        onChange={(e) => handlePriceChange(product.id, Number(e.target.value))}
                        className="w-28"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">₹{product.sellerPrice}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={product.status === 'pending'}
                      className={product.status === 'pending' ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
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
