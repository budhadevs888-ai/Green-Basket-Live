import React, { useState, useEffect } from 'react';
import { Minus, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function SellerStock() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/seller/stock').then(r => { setStockItems(r.data.stock_items || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleAdjust = async (id, adjustment) => {
    try {
      const res = await api.patch(`/api/seller/stock/${id}/adjust`, { adjustment });
      setStockItems(items => items.map(item => {
        if (item.id === id) {
          const ns = res.data.new_stock;
          return { ...item, current_stock: ns, status: ns === 0 ? 'out' : ns <= 10 ? 'low' : 'healthy' };
        }
        return item;
      }));
    } catch {}
  };

  const getStatusBadge = (status) => {
    const map = { healthy: <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>, low: <Badge className="bg-amber-100 text-amber-800 border-amber-200">Low</Badge>, out: <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge> };
    return map[status] || null;
  };

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const summary = { healthy: stockItems.filter(i => i.status === 'healthy').length, low: stockItems.filter(i => i.status === 'low').length, out: stockItems.filter(i => i.status === 'out').length };

  return (
    <div className="p-6" data-testid="seller-stock-screen">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Stock Management</h1><p className="text-sm text-gray-500 mt-1">View and adjust your current inventory</p></div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900"><p><strong>Important:</strong> Use +/- buttons only for minor adjustments. Each adjustment is by 1 unit only. Frequent edits may trigger compliance warnings.</p></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4"><div className="text-sm text-gray-600 mb-1">Healthy Stock</div><div className="text-2xl font-bold text-green-600">{summary.healthy}</div></div>
        <div className="bg-white rounded-lg border border-gray-200 p-4"><div className="text-sm text-gray-600 mb-1">Low Stock</div><div className="text-2xl font-bold text-amber-600">{summary.low}</div></div>
        <div className="bg-white rounded-lg border border-gray-200 p-4"><div className="text-sm text-gray-600 mb-1">Out of Stock</div><div className="text-2xl font-bold text-red-600">{summary.out}</div></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Product</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Unit</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Current Stock</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockItems.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No stock items</td></tr>
              ) : stockItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.product_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.unit}</td>
                  <td className="px-6 py-4 text-center"><span className={`text-lg font-bold ${item.status === 'out' ? 'text-red-600' : item.status === 'low' ? 'text-amber-600' : 'text-gray-900'}`}>{item.current_stock}</span></td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAdjust(item.id, -1)} disabled={item.current_stock === 0} className="w-9 h-9 p-0" data-testid={`stock-decrease-${item.id}`}><Minus className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleAdjust(item.id, 1)} className="w-9 h-9 p-0" data-testid={`stock-increase-${item.id}`}><Plus className="w-4 h-4" /></Button>
                    </div>
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
