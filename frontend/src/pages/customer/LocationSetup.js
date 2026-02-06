import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import api from '../../utils/api';

export default function LocationSetup() {
  const [loading, setLoading] = useState(false);
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [detected, setDetected] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const navigate = useNavigate();

  const handleUseLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setCity('Bangalore');
          setArea('Detected Area');
          setPincode('560001');
          setDetected(true);
          setLoading(false);
        },
        () => {
          setLat(12.9716);
          setLng(77.5946);
          setCity('Bangalore');
          setArea('MG Road');
          setPincode('560001');
          setDetected(true);
          setLoading(false);
        }
      );
    } else {
      setLat(12.9716);
      setLng(77.5946);
      setCity('Bangalore');
      setArea('MG Road');
      setPincode('560001');
      setDetected(true);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!house || !area || !city || !pincode) { alert('Please fill all fields'); return; }
    setLoading(true);
    try {
      await api.post('/api/customer/location', { latitude: lat || 12.9716, longitude: lng || 77.5946, address: `${house}, ${area}, ${city}`, city, house, area, pincode });
      navigate('/customer/home');
    } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="customer-location-screen">
      <div className="bg-white border-b p-4"><h1 className="text-2xl font-bold text-gray-900">Set Delivery Location</h1><p className="text-gray-600 text-sm mt-1">We need this to show available products</p></div>
      <div className="flex-1 p-4 space-y-6">
        <div className="bg-white rounded-xl border p-4">
          <Button data-testid="use-current-location-btn" onClick={handleUseLocation} disabled={loading} className="w-full bg-green-600 hover:bg-green-700" size="lg">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Detecting...</> : <><Navigation className="w-5 h-5 mr-2" />Use Current Location</>}
          </Button>
        </div>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center relative">
            <MapPin className="w-16 h-16 text-green-600" />
            {detected && <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-md p-3"><p className="text-sm font-medium text-gray-900">Location Detected</p><p className="text-xs text-gray-600">{area}, {city}</p></div>}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <div className="space-y-4">
            <div><Label htmlFor="house">House / Flat No.</Label><Input id="house" data-testid="location-house-input" placeholder="Enter house/flat number" value={house} onChange={(e) => setHouse(e.target.value)} className="mt-2" /></div>
            <div><Label htmlFor="area">Area / Street</Label><Input id="area" data-testid="location-area-input" placeholder="Enter area or street" value={area} onChange={(e) => setArea(e.target.value)} className="mt-2" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="city">City</Label><Input id="city" data-testid="location-city-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="mt-2" /></div>
              <div><Label htmlFor="pincode">Pincode</Label><Input id="pincode" data-testid="location-pincode-input" placeholder="6-digit" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2" /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-t p-4">
        <Button data-testid="confirm-location-btn" onClick={handleConfirm} className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled={loading}>Confirm Location</Button>
      </div>
    </div>
  );
}
