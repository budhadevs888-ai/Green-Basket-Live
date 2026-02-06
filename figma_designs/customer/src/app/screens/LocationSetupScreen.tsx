import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const LocationSetupScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [locationDetected, setLocationDetected] = useState(false);
  
  const { setLocation } = useApp();
  const navigate = useNavigate();

  const handleUseCurrentLocation = () => {
    setLoading(true);
    // Simulate GPS location detection
    setTimeout(() => {
      setLocationDetected(true);
      setArea('MG Road');
      setCity('Bangalore');
      setPincode('560001');
      setLoading(false);
      toast.success('Location detected');
    }, 1500);
  };

  const handleConfirmLocation = () => {
    if (!house || !area || !city || !pincode) {
      toast.error('Please fill all fields');
      return;
    }

    if (pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setLocation({
      house,
      area,
      city,
      pincode,
      lat: 12.9716,
      lng: 77.5946,
    });

    toast.success('Location saved successfully');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-900">Set Delivery Location</h1>
        <p className="text-gray-600 text-sm mt-1">We need this to show available products</p>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <Card className="p-4">
          <Button
            onClick={handleUseCurrentLocation}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Detecting Location...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5 mr-2" />
                Use Current Location
              </>
            )}
          </Button>
        </Card>

        {/* Mock Map View */}
        <Card className="overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center relative">
            <MapPin className="w-16 h-16 text-green-600" />
            {locationDetected && (
              <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-md p-3">
                <p className="text-sm font-medium text-gray-900">Location Detected</p>
                <p className="text-xs text-gray-600">{area}, {city}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="house">House / Flat No.</Label>
              <Input
                id="house"
                placeholder="Enter house/flat number"
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="area">Area / Street</Label>
              <Input
                id="area"
                placeholder="Enter area or street"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="6-digit"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border-t p-4">
        <Button
          onClick={handleConfirmLocation}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
};
