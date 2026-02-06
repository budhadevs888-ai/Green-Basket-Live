import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function DailyStock() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    api.get('/api/seller/products').then(r => {
      const items = (r.data.products || [])
        .filter(p => p.status === 'APPROVED')
        .map(p => ({ ...p, todayStock: '' }));
      setStockItems(items);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleStockChange = (id, value) => {
    if (value && !/^\d+$/.test(value)) return;
    setStockItems(items => items.map(item => item.id === id ? { ...item, todayStock: value } : item));
  };

  const isFormValid = stockItems.length > 0 && stockItems.every(item => item.todayStock !== '');

  const handleConfirm = async () => {
    if (!isFormValid) return;
    setConfirming(true);
    try {
      const items = stockItems.map(item => ({ product_id: item.id, stock: parseInt(item.todayStock) }));
      await api.post('/api/seller/stock/daily-confirm', { items });
      navigate('/seller/dashboard');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to confirm stock');
    }
    setConfirming(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-testid="seller-daily-stock-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <ShoppingBasket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Confirm Today's Stock</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4" />
                <span>{today}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Important:</strong> You must confirm your stock every day before accessing the dashboard.
            Enter the current stock quantity for each product.
          </p>
        </div>

        {stockItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-2">No approved products found.</p>
            <p className="text-sm text-gray-400">Ask admin to approve your products first.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Product Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Unit</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Current Stock</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Today's Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stockItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.unit}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600">{item.stock || 0}</td>
                      <td className="px-6 py-4">
                        <Input
                          data-testid={`stock-input-${item.id}`}
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={item.todayStock}
                          onChange={(e) => handleStockChange(item.id, e.target.value)}
                          className="w-32"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            data-testid="confirm-stock-btn"
            onClick={handleConfirm}
            disabled={!isFormValid || confirming}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {confirming ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Confirming...</> : 'Confirm & Continue'}
          </Button>
          <Button onClick={logout} variant="outline" className="w-32">Logout</Button>
        </div>

        {!isFormValid && stockItems.length > 0 && (
          <p className="text-sm text-amber-600 text-center mt-3">Please fill in stock quantities for all products (0 is allowed)</p>
        )}
      </div>
    </div>
  );
}
