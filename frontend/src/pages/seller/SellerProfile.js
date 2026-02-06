import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Store, CheckCircle, Package, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function SellerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    api.get('/api/seller/profile').then(r => { setProfile(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const p = profile || {};

  return (
    <div className="p-6" data-testid="seller-profile-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Profile</h1><p className="text-sm text-gray-500 mt-1">Your shop information and settings</p></div>
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
            <div className="flex items-start justify-between">
              <div><div className="flex items-center gap-3 mb-2"><Store className="w-6 h-6" /><h2 className="text-xl font-bold">{p.shop_name || 'My Shop'}</h2></div><p className="text-green-100 text-sm">Seller</p></div>
              <Badge className="bg-white text-green-700 border-0"><CheckCircle className="w-3 h-3 mr-1" />{p.approval_status || 'N/A'}</Badge>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg"><Phone className="w-5 h-5 text-gray-600" /></div>
              <div className="flex-1"><div className="text-sm text-gray-500 mb-1">Phone Number</div><div className="font-medium text-gray-900">{p.phone}</div><div className="text-xs text-gray-500 mt-1">(Read-only)</div></div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg"><MapPin className="w-5 h-5 text-gray-600" /></div>
              <div className="flex-1"><div className="text-sm text-gray-500 mb-1">Location</div><div className="font-medium text-gray-900">{p.address || p.city || 'Not set'}</div><div className="text-xs text-gray-500 mt-1">(Cannot be edited)</div></div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg"><CheckCircle className="w-5 h-5 text-gray-600" /></div>
              <div className="flex-1"><div className="text-sm text-gray-500 mb-1">Approval Status</div><Badge className="bg-green-100 text-green-800 border-green-200">{p.approval_status || 'N/A'}</Badge></div>
            </div>
            {p.categories && p.categories.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg"><Package className="w-5 h-5 text-gray-600" /></div>
                <div className="flex-1"><div className="text-sm text-gray-500 mb-1">Categories</div><div className="flex flex-wrap gap-2 mt-2">{p.categories.map((c, i) => <Badge key={i} variant="outline">{c}</Badge>)}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Account Info</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"><div><div className="font-medium text-gray-900">Total Orders Fulfilled</div></div><span className="font-semibold">{p.total_orders_fulfilled || 0}</span></div>
          </div>
        </div>

        <Button data-testid="seller-profile-logout-btn" onClick={logout} variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
      </div>
    </div>
  );
}
