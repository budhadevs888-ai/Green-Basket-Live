import { useState } from 'react';
import { mockDeliveryPartners } from '../mockData';
import { DeliveryPartner, ApprovalStatus } from '../types';
import { Check, Ban, History } from 'lucide-react';

export function DeliveryPartners() {
  const [activeTab, setActiveTab] = useState<ApprovalStatus | 'all'>('pending');
  const [partners, setPartners] = useState(mockDeliveryPartners);

  const tabs = [
    { id: 'pending' as const, label: 'Pending', count: partners.filter(p => p.status === 'pending').length },
    { id: 'approved' as const, label: 'Approved', count: partners.filter(p => p.status === 'approved').length },
    { id: 'suspended' as const, label: 'Suspended', count: partners.filter(p => p.status === 'suspended').length },
  ];

  const filteredPartners = partners.filter(partner => partner.status === activeTab);

  const handleApprove = (partnerId: string) => {
    setPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, status: 'approved' as const } : p
    ));
  };

  const handleSuspend = (partnerId: string) => {
    setPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, status: 'suspended' as const } : p
    ));
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

  const getAvailabilityBadge = (availability: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-orange-100 text-orange-800',
      offline: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[availability as keyof typeof styles]}`}>
        {availability.charAt(0).toUpperCase() + availability.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Delivery Partners</h1>
        <p className="text-gray-600 mt-1">Manage delivery partner approvals and status</p>
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
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
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No delivery partners found in this category
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {partner.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {partner.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {partner.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAvailabilityBadge(partner.availability)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(partner.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {partner.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(partner.id)}
                            className="text-green-600 hover:text-green-900 font-medium flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                        )}
                        {partner.status === 'approved' && (
                          <button
                            onClick={() => handleSuspend(partner.id)}
                            className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                          >
                            <Ban className="w-4 h-4" />
                            Suspend
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
                          <History className="w-4 h-4" />
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
