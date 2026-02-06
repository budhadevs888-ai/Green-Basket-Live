import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Loader2, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import api from '../../utils/api';

export default function SellerRegister() {
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

  const categoryOptions = ['Fruits', 'Vegetables', 'Dairy', 'Grocery', 'Snacks', 'Beverages', 'Personal Care', 'Household'];

  const toggleCategory = (cat) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const initMap = useCallback((latitude, longitude) => {
    if (!window.google || !mapRef.current) return;
    const pos = { lat: latitude, lng: longitude };
    const map = new window.google.maps.Map(mapRef.current, { center: pos, zoom: 15, disableDefaultUI: true, zoomControl: true });
    const marker = new window.google.maps.Marker({ position: pos, map, draggable: true });
    mapInstanceRef.current = map;
    markerRef.current = marker;

    marker.addListener('dragend', () => {
      const p = marker.getPosition();
      setLat(p.lat());
      setLng(p.lng());
      reverseGeocode(p.lat(), p.lng());
    });

    map.addListener('click', (e) => {
      marker.setPosition(e.latLng);
      setLat(e.latLng.lat());
      setLng(e.latLng.lng());
      reverseGeocode(e.latLng.lat(), e.latLng.lng());
    });
  }, []);

  const reverseGeocode = (latitude, longitude) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
        const comps = results[0].address_components;
        const cityComp = comps.find(c => c.types.includes('locality'));
        if (cityComp) setCity(cityComp.long_name);
      }
    });
  };

  const handleDetectLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lt = pos.coords.latitude;
          const ln = pos.coords.longitude;
          setLat(lt); setLng(ln);
          initMap(lt, ln);
          reverseGeocode(lt, ln);
          setLocating(false);
        },
        () => {
          setLat(12.9716); setLng(77.5946);
          setCity('Bangalore'); setAddress('Bangalore, Karnataka');
          initMap(12.9716, 77.5946);
          setLocating(false);
        }
      );
    } else {
      setLat(12.9716); setLng(77.5946);
      setCity('Bangalore'); setAddress('Bangalore, Karnataka');
      initMap(12.9716, 77.5946);
      setLocating(false);
    }
  };

  useEffect(() => { handleDetectLocation(); }, []);

  const handleSubmit = async () => {
    if (!shopName.trim() || !city.trim() || !address.trim()) {
      alert('Please fill shop name, city and address'); return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/seller/register', {
        shop_name: shopName, city, address, latitude: lat, longitude: lng,
        bank_account: bankAccount, bank_ifsc: bankIfsc, bank_name: bankName, categories,
      });
      navigate(res.data.redirect || '/seller/approval-status');
    } catch (err) { alert(err.response?.data?.detail || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="seller-register-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center"><Store className="w-6 h-6 text-white" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Seller Registration</h1><p className="text-sm text-gray-500">Complete your shop details</p></div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Store className="w-5 h-5 text-green-600" />Shop Details</h2>
          <div className="space-y-4">
            <div><Label>Shop Name *</Label><Input data-testid="register-shop-name" placeholder="Enter your shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} className="mt-2" /></div>
            <div>
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categoryOptions.map(cat => (
                  <button key={cat} type="button" onClick={() => toggleCategory(cat)} data-testid={`category-${cat.toLowerCase()}`}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${categories.includes(cat) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-600" />Shop Location</h2>
          <div className="space-y-4">
            <div ref={mapRef} className="w-full h-64 rounded-lg bg-gray-100 border" data-testid="seller-register-map" />
            <Button variant="outline" onClick={handleDetectLocation} disabled={locating} data-testid="detect-location-btn">
              {locating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Detecting...</> : <><MapPin className="w-4 h-4 mr-2" />Detect My Location</>}
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>City *</Label><Input data-testid="register-city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-2" /></div>
              <div><Label>Full Address *</Label><Input data-testid="register-address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2" /></div>
            </div>
            {lat !== 0 && <p className="text-xs text-gray-400">GPS: {lat.toFixed(6)}, {lng.toFixed(6)}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-green-600" />Bank Details (Optional)</h2>
          <div className="space-y-4">
            <div><Label>Bank Name</Label><Input data-testid="register-bank-name" placeholder="e.g., State Bank of India" value={bankName} onChange={(e) => setBankName(e.target.value)} className="mt-2" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Account Number</Label><Input data-testid="register-bank-account" placeholder="Account number" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="mt-2" /></div>
              <div><Label>IFSC Code</Label><Input data-testid="register-bank-ifsc" placeholder="IFSC code" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)} className="mt-2" /></div>
            </div>
          </div>
        </div>

        <Button data-testid="submit-registration-btn" onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 hover:bg-green-700" size="lg">
          {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</> : 'Submit Registration'}
        </Button>
      </div>
    </div>
  );
}
