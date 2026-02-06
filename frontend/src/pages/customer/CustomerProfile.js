import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { api.get('/api/customer/profile').then(r => { setProfile(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const p = profile || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="customer-profile-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/customer/home')}><ArrowLeft className="w-5 h-5" /></Button><h1 className="text-xl font-bold">My Profile</h1></div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-4 mb-4"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Phone className="w-8 h-8 text-green-600" /></div><div><p className="text-sm text-gray-500">Phone Number</p><p className="text-lg font-semibold text-gray-900">+91 {p.phone}</p></div></div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-gray-600" /><h3 className="font-semibold text-gray-900">Delivery Address</h3></div>
          {p.location_set ? <div className="text-sm text-gray-600"><p>{p.house}</p><p>{p.area}</p><p>{p.city} - {p.pincode}</p></div> : <p className="text-sm text-gray-400">No address saved</p>}
        </div>
        <div className="bg-white rounded-xl border p-6"><h3 className="font-semibold text-gray-900 mb-3">About</h3><div className="space-y-2 text-sm text-gray-600"><p>Green Basket v1.0</p><p>Fresh groceries at your doorstep</p></div></div>
        <Button data-testid="customer-logout-btn" onClick={() => { logout(); navigate('/customer/login'); }} variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
      </div>
      <div className="bg-white border-t p-3"><div className="flex justify-around max-w-2xl mx-auto"><Button variant="ghost" onClick={() => navigate('/customer/home')} className="flex-col h-auto gap-1"><span className="text-xs">Home</span></Button><Button variant="ghost" onClick={() => navigate('/customer/orders')} className="flex-col h-auto gap-1"><span className="text-xs">Orders</span></Button><Button variant="ghost" className="flex-col h-auto gap-1 text-green-600"><span className="text-xs">Profile</span></Button></div></div>
    </div>
  );
}
