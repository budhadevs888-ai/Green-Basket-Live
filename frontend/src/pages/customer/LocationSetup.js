import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

  const initMap = useCallback((latitude, longitude) => {
    if (!window.google || !mapRef.current) return;
    const pos = { lat: latitude, lng: longitude };
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(pos);
      markerRef.current?.setPosition(pos);
      return;
    }
    const map = new window.google.maps.Map(mapRef.current, {
      center: pos, zoom: 16, disableDefaultUI: true, zoomControl: true,
      styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
    });
    const marker = new window.google.maps.Marker({ position: pos, map, draggable: true, animation: window.google.maps.Animation.DROP });
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
        const comps = results[0].address_components;
        const localArea = comps.find(c => c.types.includes('sublocality_level_1') || c.types.includes('sublocality'));
        const cityComp = comps.find(c => c.types.includes('locality'));
        const postalCode = comps.find(c => c.types.includes('postal_code'));
        if (localArea) setArea(localArea.long_name);
        if (cityComp) setCity(cityComp.long_name);
        if (postalCode) setPincode(postalCode.long_name);
        setDetected(true);
      }
    });
  };

  const handleUseLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lt = pos.coords.latitude;
          const ln = pos.coords.longitude;
          setLat(lt); setLng(ln);
          initMap(lt, ln);
          reverseGeocode(lt, ln);
          setDetected(true); setLoading(false);
        },
        () => {
          setLat(12.9716); setLng(77.5946);
          setCity('Bangalore'); setArea('MG Road'); setPincode('560001');
          initMap(12.9716, 77.5946);
          setDetected(true); setLoading(false);
        }
      );
    } else {
      setLat(12.9716); setLng(77.5946);
      setCity('Bangalore'); setArea('MG Road'); setPincode('560001');
      initMap(12.9716, 77.5946);
      setDetected(true); setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.google && mapRef.current && !mapInstanceRef.current) {
        initMap(12.9716, 77.5946);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [initMap]);

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
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-xl border p-4">
          <Button data-testid="use-current-location-btn" onClick={handleUseLocation} disabled={loading} className="w-full bg-green-600 hover:bg-green-700" size="lg">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Detecting...</> : <><Navigation className="w-5 h-5 mr-2" />Use Current Location</>}
          </Button>
        </div>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div ref={mapRef} className="h-64 bg-gray-100" data-testid="google-map-container" />
          {detected && (
            <div className="p-3 bg-green-50 border-t border-green-200">
              <p className="text-sm font-medium text-green-900">Location Detected</p>
              <p className="text-xs text-green-700">{area}, {city}</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <div className="space-y-4">
            <div><Label htmlFor="house">House / Flat No. *</Label><Input id="house" data-testid="location-house-input" placeholder="Enter house/flat number" value={house} onChange={(e) => setHouse(e.target.value)} className="mt-2" /></div>
            <div><Label htmlFor="area">Area / Street *</Label><Input id="area" data-testid="location-area-input" placeholder="Enter area or street" value={area} onChange={(e) => setArea(e.target.value)} className="mt-2" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="city">City *</Label><Input id="city" data-testid="location-city-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="mt-2" /></div>
              <div><Label htmlFor="pincode">Pincode *</Label><Input id="pincode" data-testid="location-pincode-input" placeholder="6-digit" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2" /></div>
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
