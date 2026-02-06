import React, { useState, useEffect } from 'react';
import { Shield, Phone, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => { api.get('/api/admin/profile').then(r => { setProfile(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  const p = profile || {};

  return (
    <div className="p-6" data-testid="admin-profile-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1></div>
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center"><Shield className="w-8 h-8 text-indigo-600" /></div><div><p className="text-sm text-gray-500">Administrator</p><p className="text-lg font-semibold text-gray-900">Green Basket Admin</p></div></div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"><Phone className="w-5 h-5 text-gray-600" /><div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{p.phone}</p></div></div>
            <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Role</p><p className="font-medium">{p.role}</p></div>
          </div>
        </div>
        <Button data-testid="admin-logout-btn" onClick={logout} variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
      </div>
    </div>
  );
}
