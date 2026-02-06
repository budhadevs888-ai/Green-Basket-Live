import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function DeliveryProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { api.get('/api/delivery/profile').then(r => { setProfile(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  const p = profile || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="delivery-profile-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/delivery/availability')}><ArrowLeft className="w-5 h-5" /></Button><h1 className="text-xl font-bold">My Profile</h1></div>
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-4 mb-4"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><Phone className="w-8 h-8 text-blue-600" /></div><div><p className="text-sm text-gray-500">Phone</p><p className="text-lg font-semibold">+91 {p.phone}</p></div></div>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">City</span><span className="text-sm font-medium">{p.city || 'N/A'}</span></div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Status</span><Badge className={p.approval_status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>{p.approval_status || 'N/A'}</Badge></div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500">Availability</span><Badge className={p.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>{p.is_available ? 'Online' : 'Offline'}</Badge></div>
          </div>
        </div>
        <Button data-testid="delivery-profile-logout-btn" onClick={() => { logout(); navigate('/delivery/login'); }} variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
      </div>
    </div>
  );
}
