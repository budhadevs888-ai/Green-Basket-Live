import React, { useState } from 'react';
import { ShoppingBasket, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface DailyStockConfirmationProps {
  onConfirm: () => void;
  onLogout: () => void;
}

interface StockItem {
  id: string;
  productName: string;
  unit: string;
  yesterdayStock: number;
  soldYesterday: number;
  todayStock: string;
}

export default function DailyStockConfirmation({ onConfirm, onLogout }: DailyStockConfirmationProps) {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      productName: 'Tomatoes',
      unit: '1kg',
      yesterdayStock: 50,
      soldYesterday: 23,
      todayStock: '',
    },
    {
      id: '2',
      productName: 'Onions',
      unit: '1kg',
      yesterdayStock: 40,
      soldYesterday: 15,
      todayStock: '',
    },
    {
      id: '3',
      productName: 'Potatoes',
      unit: '1kg',
      yesterdayStock: 60,
      soldYesterday: 28,
      todayStock: '',
    },
    {
      id: '4',
      productName: 'Carrots',
      unit: '500g',
      yesterdayStock: 35,
      soldYesterday: 12,
      todayStock: '',
    },
    {
      id: '5',
      productName: 'Spinach',
      unit: '250g',
      yesterdayStock: 30,
      soldYesterday: 18,
      todayStock: '',
    },
  ]);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  const handleStockChange = (id: string, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    setStockItems(items =>
      items.map(item =>
        item.id === id ? { ...item, todayStock: value } : item
      )
    );
  };

  const isFormValid = stockItems.every(item => item.todayStock !== '');

  const handleConfirm = () => {
    if (isFormValid) {
      onConfirm();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
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

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Important:</strong> You must confirm your stock every day before accessing the dashboard. 
            Enter the current stock quantity for each product.
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Last confirmed: {yesterday}
          </p>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Product Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Unit</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Yesterday Stock</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Sold Yesterday</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Today's Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">
                      {item.yesterdayStock}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">
                      {item.soldYesterday}
                    </td>
                    <td className="px-6 py-4">
                      <Input
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

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Confirm & Continue
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-32"
          >
            Logout
          </Button>
        </div>

        {!isFormValid && (
          <p className="text-sm text-amber-600 text-center mt-3">
            Please fill in stock quantities for all products (0 is allowed)
          </p>
        )}
      </div>
    </div>
  );
}
