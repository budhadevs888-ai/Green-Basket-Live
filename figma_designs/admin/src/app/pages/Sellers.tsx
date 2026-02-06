import { useState } from 'react';
import { mockSellers } from '../mockData';
import { Seller, ApprovalStatus } from '../types';
import { Eye, Check, X, Ban, FileText } from 'lucide-react';

export function Sellers() {
  const [activeTab, setActiveTab] = useState<ApprovalStatus | 'all'>('pending');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [sellers, setSellers] = useState(mockSellers);

  const tabs = [
    { id: 'pending' as const, label: 'Pending Approval', count: sellers.filter(s => s.status === 'pending').length },
    { id: 'approved' as const, label: 'Approved', count: sellers.filter(s => s.status === 'approved').length },
    { id: 'suspended' as const, label: 'Suspended', count: sellers.filter(s => s.status === 'suspended').length },
  ];

  const filteredSellers = sellers.filter(seller => seller.status === activeTab);

  const handleApprove = (sellerId: string) => {
    setSellers(prev => prev.map(s => 
      s.id === sellerId ? { ...s, status: 'approved' as const } : s
    ));
    setSelectedSeller(null);
  };

  const handleReject = (sellerId: string) => {
    setSellers(prev => prev.map(s => 
      s.id === sellerId ? { ...s, status: 'rejected' as const } : s
    ));
    setSelectedSeller(null);
  };

  const handleSuspend = (sellerId: string) => {
    setSellers(prev => prev.map(s => 
      s.id === sellerId ? { ...s, status: 'suspended' as const } : s
    ));
    setSelectedSeller(null);
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800',
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
        <h1 className="text-3xl font-semibold text-gray-900">Sellers</h1>
        <p className="text-gray-600 mt-1">Manage seller approvals and status</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No sellers found in this category
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {seller.shopName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {seller.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {seller.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(seller.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedSeller(seller)}
                        className="text-green-600 hover:text-green-900 font-medium flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Seller Details</h2>
              <button
                onClick={() => setSelectedSeller(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Shop Name</label>
                  <p className="text-base text-gray-900 mt-1">{selectedSeller.shopName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-base text-gray-900 mt-1">{selectedSeller.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-base text-gray-900 mt-1">{selectedSeller.location}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedSeller.status)}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="text-base text-gray-900 mt-1">{selectedSeller.registrationDate}</p>
                </div>

                {selectedSeller.categories && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Categories</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedSeller.categories.map((category, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSeller.documents && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted Documents</label>
                    <div className="space-y-2 mt-1">
                      {selectedSeller.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedSeller.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedSeller.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedSeller.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {selectedSeller.status === 'approved' && (
                  <button
                    onClick={() => handleSuspend(selectedSeller.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Suspend
                  </button>
                )}
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
