import React from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, Info } from 'lucide-react';
import { Badge } from '../ui/badge';

interface EarningTransaction {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
}

export default function Earnings() {
  const transactions: EarningTransaction[] = [
    { id: '1', orderId: 'ORD-1234', date: 'Feb 6, 2026', amount: 115, status: 'pending' },
    { id: '2', orderId: 'ORD-1235', date: 'Feb 6, 2026', amount: 90, status: 'pending' },
    { id: '3', orderId: 'ORD-1230', date: 'Feb 5, 2026', amount: 110, status: 'pending' },
    { id: '4', orderId: 'ORD-1228', date: 'Feb 5, 2026', amount: 100, status: 'pending' },
    { id: '5', orderId: 'ORD-1220', date: 'Feb 4, 2026', amount: 230, status: 'paid' },
    { id: '6', orderId: 'ORD-1218', date: 'Feb 4, 2026', amount: 180, status: 'paid' },
    { id: '7', orderId: 'ORD-1215', date: 'Feb 3, 2026', amount: 145, status: 'paid' },
    { id: '8', orderId: 'ORD-1210', date: 'Feb 3, 2026', amount: 200, status: 'paid' },
  ];

  const totalEarned = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPaid = transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your financial transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Total Earned</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">₹{totalEarned.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+15% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Paid</span>
          </div>
          <div className="text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
          <p className="text-sm text-gray-500 mt-2">Successfully settled</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">₹{totalPending.toLocaleString()}</div>
          <p className="text-sm text-gray-500 mt-2">Awaiting settlement</p>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p><strong>Note:</strong> All payouts are handled by admin. Payments are typically processed 
          weekly to your registered bank account. Contact support for payout-related queries.</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Order ID</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {transaction.orderId}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                    ₹{transaction.amount}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(transaction.status)}
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
