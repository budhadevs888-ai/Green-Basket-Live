import React, { useEffect, useState } from 'react';
import { Truck, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function DeliveryApprovalStatus() {
  const { logout, getStoredUser } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const s = getStoredUser();
    if (s) setUser(s);
    api.get('/api/delivery/profile').then(r => setUser(r.data)).catch(() => {});
  }, [getStoredUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" data-testid="delivery-approval-screen">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6"><Truck className="w-9 h-9 text-white" /></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"><Clock className="w-10 h-10 text-amber-600" /></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Approval Pending</h1>
          <p className="text-gray-500 mb-6">Your delivery partner account is under review. This usually takes 24-48 hours.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-500">Phone</span><span className="text-sm font-medium">{user?.phone || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">Status</span><span className="text-sm font-medium text-amber-600">{user?.approval_status || 'PENDING'}</span></div>
          </div>
        </div>
        <Button data-testid="delivery-approval-logout-btn" onClick={logout} variant="outline" className="w-full">Logout</Button>
      </div>
    </div>
  );
}
