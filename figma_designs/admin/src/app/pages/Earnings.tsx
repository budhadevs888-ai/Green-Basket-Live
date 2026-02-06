import { useState, useMemo } from 'react';
import { mockEarnings } from '../mockData';
import { DollarSign } from 'lucide-react';

export function Earnings() {
  const [activeTab, setActiveTab] = useState<'sellers' | 'delivery'>('sellers');
  const [earnings] = useState(mockEarnings);

  const filteredEarnings = earnings.filter(e => e.role === (activeTab === 'sellers' ? 'seller' : 'delivery'));

  const summary = useMemo(() => {
    const total = filteredEarnings.reduce((sum, e) => sum + e.amount, 0);
    const pending = filteredEarnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
    const paid = filteredEarnings.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
    
    return { total, pending, paid };
  }, [filteredEarnings]);

  const getStatusBadge = (status: 'pending' | 'paid') => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-1">Financial monitoring and payout tracking</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'sellers'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sellers
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Delivery Partners
          </button>
        </nav>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">${summary.total.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Pending Payout</p>
              <p className="text-2xl font-semibold text-gray-900">${summary.pending.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-50 text-yellow-600 p-3 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Paid Out</p>
              <p className="text-2xl font-semibold text-gray-900">${summary.paid.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEarnings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No earnings found
                  </td>
                </tr>
              ) : (
                filteredEarnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {earning.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {earning.role.charAt(0).toUpperCase() + earning.role.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {earning.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${earning.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(earning.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {earning.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a read-only ledger. Manual edits are not permitted.
        </p>
      </div>
    </div>
  );
}
