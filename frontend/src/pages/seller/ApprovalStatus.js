import React, { useEffect, useState } from 'react';
import { ShoppingBasket, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function ApprovalStatus() {
  const { logout, getStoredUser } = useAuth();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setSeller(stored);
    api.get('/api/seller/profile').then(r => setSeller(r.data)).catch(() => {});
  }, [getStoredUser]);

  const approvalStatus = seller?.approval_status || 'PENDING';

  const steps = [
    { id: 'registration', label: 'Registration Submitted', status: 'completed' },
    { id: 'documents', label: 'Document Verification', status: approvalStatus === 'PENDING' ? 'pending' : 'completed' },
    { id: 'location', label: 'Location Verification', status: approvalStatus === 'APPROVED' ? 'completed' : 'pending' },
    { id: 'approval', label: 'Final Approval', status: approvalStatus === 'APPROVED' ? 'completed' : approvalStatus === 'REJECTED' ? 'rejected' : 'pending' },
  ];

  const getIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    if (status === 'rejected') return <Clock className="w-6 h-6 text-red-600" />;
    return <Clock className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" data-testid="seller-approval-screen">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <ShoppingBasket className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Approval Status</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Your account is under review</p>
              <p className="text-sm text-amber-700 mt-1">We are verifying your documents and location. This usually takes 24-48 hours.</p>
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex-shrink-0">{getIcon(step.status)}</div>
                <div className={`flex-1 ${i < steps.length - 1 ? 'pb-6 border-l-2 border-gray-200 pl-6 ml-3' : 'pl-6 ml-3'}`}>
                  <h3 className={`font-medium ${step.status === 'completed' ? 'text-green-900' : step.status === 'rejected' ? 'text-red-900' : 'text-gray-500'}`}>
                    {step.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {step.status === 'completed' && 'Completed'}
                    {step.status === 'pending' && 'Pending'}
                    {step.status === 'rejected' && 'Rejected'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Shop Name</span>
              <span className="text-sm font-medium text-gray-900">{seller?.shop_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Phone Number</span>
              <span className="text-sm font-medium text-gray-900">{seller?.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Location</span>
              <span className="text-sm font-medium text-gray-900">{seller?.address || seller?.city || 'N/A'}</span>
            </div>
          </div>
        </div>

        <Button data-testid="seller-approval-logout-btn" onClick={logout} variant="outline" className="w-full">Logout</Button>
      </div>
    </div>
  );
}
