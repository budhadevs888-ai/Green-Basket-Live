import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import api from '../../utils/api';

export default function DeliveryRegister() {
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

  const vehicleTypes = ['Bicycle', 'Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler'];

  const initMap = useCallback((latitude, longitude) => {
    if (!window.google || !mapRef.current) return;
    const pos = { lat: latitude, lng: longitude };
    const map = new window.google.maps.Map(mapRef.current, { center: pos, zoom: 15, disableDefaultUI: true, zoomControl: true });
    const marker = new window.google.maps.Marker({ position: pos, map, draggable: true });
    mapInstanceRef.current = map;
    markerRef.current = marker;

    marker.addListener('dragend', () => {
      const p = marker.getPosition();
      setLat(p.lat()); setLng(p.lng());
      reverseGeocode(p.lat(), p.lng());
    });

    map.addListener('click', (e) => {
      marker.setPosition(e.latLng);
      setLat(e.latLng.lat()); setLng(e.latLng.lng());
      reverseGeocode(e.latLng.lat(), e.latLng.lng());
    });
  }, []);

  const reverseGeocode = (latitude, longitude) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
        const cityComp = results[0].address_components.find(c => c.types.includes('locality'));
        if (cityComp) setCity(cityComp.long_name);
      }
    });
  };

  const handleDetectLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); initMap(pos.coords.latitude, pos.coords.longitude); reverseGeocode(pos.coords.latitude, pos.coords.longitude); setLocating(false); },
        () => { setLat(12.9716); setLng(77.5946); setCity('Bangalore'); setAddress('Bangalore, Karnataka'); initMap(12.9716, 77.5946); setLocating(false); }
      );
    } else { setLat(12.9716); setLng(77.5946); setCity('Bangalore'); setAddress('Bangalore, Karnataka'); initMap(12.9716, 77.5946); setLocating(false); }
  };

  useEffect(() => { handleDetectLocation(); }, []);

  const handleSubmit = async () => {
    if (!city.trim() || !address.trim()) { alert('Please fill city and address'); return; }
    setLoading(true);
    try {
      const res = await api.post('/api/delivery/register', { city, address, latitude: lat, longitude: lng, vehicle_type: vehicleType, vehicle_number: vehicleNumber });
      navigate(res.data.redirect || '/delivery/approval-status');
    } catch (err) { alert(err.response?.data?.detail || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="delivery-register-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><Truck className="w-6 h-6 text-white" /></div>
        <div><h1 className="text-xl font-bold text-gray-900">Delivery Partner Registration</h1><p className="text-sm text-gray-500">Complete your details to get started</p></div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" />Your Location</h2>
          <div className="space-y-4">
            <div ref={mapRef} className="w-full h-64 rounded-lg bg-gray-100 border" data-testid="delivery-register-map" />
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
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-blue-600" />Vehicle Details</h2>
          <div className="space-y-4">
            <div>
              <Label>Vehicle Type</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {vehicleTypes.map(type => (
                  <button key={type} type="button" onClick={() => setVehicleType(type)} data-testid={`vehicle-${type.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${vehicleType === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div><Label>Vehicle Number (if applicable)</Label><Input data-testid="register-vehicle-number" placeholder="e.g., KA01AB1234" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} className="mt-2" /></div>
          </div>
        </div>

        <Button data-testid="submit-delivery-registration-btn" onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</> : 'Submit Registration'}
        </Button>
      </div>
    </div>
  );
}
