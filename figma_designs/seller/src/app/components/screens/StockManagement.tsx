import React, { useState } from 'react';
import { Minus, Plus, History, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface StockItem {
  id: string;
  productName: string;
  unit: string;
  currentStock: number;
  status: 'healthy' | 'low' | 'out';
}

export default function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    { id: '1', productName: 'Tomatoes', unit: '1kg', currentStock: 45, status: 'healthy' },
    { id: '2', productName: 'Onions', unit: '1kg', currentStock: 38, status: 'healthy' },
    { id: '3', productName: 'Potatoes', unit: '1kg', currentStock: 52, status: 'healthy' },
    { id: '4', productName: 'Carrots', unit: '500g', currentStock: 8, status: 'low' },
    { id: '5', productName: 'Spinach', unit: '250g', currentStock: 15, status: 'healthy' },
    { id: '6', productName: 'Cabbage', unit: '1pc', currentStock: 5, status: 'low' },
    { id: '7', productName: 'Cauliflower', unit: '1pc', currentStock: 0, status: 'out' },
  ]);

  const handleIncrement = (id: string) => {
    setStockItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newStock = item.currentStock + 1;
          return {
            ...item,
            currentStock: newStock,
            status: newStock === 0 ? 'out' : newStock <= 10 ? 'low' : 'healthy'
          };
        }
        return item;
      })
    );
  };

  const handleDecrement = (id: string) => {
    setStockItems(items =>
      items.map(item => {
        if (item.id === id && item.currentStock > 0) {
          const newStock = item.currentStock - 1;
          return {
            ...item,
            currentStock: newStock,
            status: newStock === 0 ? 'out' : newStock <= 10 ? 'low' : 'healthy'
          };
        }
        return item;
      })
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>;
      case 'low':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Low</Badge>;
      case 'out':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and adjust your current inventory
          </p>
        </div>
        <Button variant="outline">
          <History className="w-4 h-4 mr-2" />
          View Stock History
        </Button>
      </div>

      {/* Warning Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p><strong>Important:</strong> Use +/- buttons only for minor adjustments (e.g., damaged items, corrections). 
          Each adjustment is by 1 unit only. Frequent edits may trigger compliance warnings. 
          Major stock updates should be done through daily stock confirmation.</p>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Healthy Stock</div>
          <div className="text-2xl font-bold text-green-600">
            {stockItems.filter(i => i.status === 'healthy').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Low Stock</div>
          <div className="text-2xl font-bold text-amber-600">
            {stockItems.filter(i => i.status === 'low').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">
            {stockItems.filter(i => i.status === 'out').length}
          </div>
        </div>
      </div>

      {/* Stock Table */}
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
              {stockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-lg font-bold ${
                      item.status === 'out' ? 'text-red-600' :
                      item.status === 'low' ? 'text-amber-600' :
                      'text-gray-900'
                    }`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDecrement(item.id)}
                              disabled={item.currentStock === 0}
                              className="w-9 h-9 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Decrease by 1 unit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleIncrement(item.id)}
                              className="w-9 h-9 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Increase by 1 unit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
