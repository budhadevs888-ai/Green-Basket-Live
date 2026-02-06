import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, LogOut, Edit2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const ProfileScreen: React.FC = () => {
  const { phoneNumber, location, setLocation, logout } = useApp();
  const [editing, setEditing] = useState(false);
  const [house, setHouse] = useState(location?.house || '');
  const [area, setArea] = useState(location?.area || '');
  const [city, setCity] = useState(location?.city || '');
  const [pincode, setPincode] = useState(location?.pincode || '');
  const navigate = useNavigate();

  const handleSaveAddress = () => {
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
    });

    setEditing(false);
    toast.success('Address updated successfully');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/home')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">My Profile</h1>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* User Info */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">+91 {phoneNumber}</p>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Delivery Address</h3>
            </div>
            {!editing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {editing ? (
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

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveAddress}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Save Address
                </Button>
                <Button
                  onClick={() => {
                    setEditing(false);
                    setHouse(location?.house || '');
                    setArea(location?.area || '');
                    setCity(location?.city || '');
                    setPincode(location?.pincode || '');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {location ? (
                <>
                  <p>{location.house}</p>
                  <p>{location.area}</p>
                  <p>{location.city} - {location.pincode}</p>
                </>
              ) : (
                <p>No address saved</p>
              )}
            </div>
          )}
        </Card>

        {/* App Info */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">About</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Green Basket v1.0</p>
            <p>Fresh groceries at your doorstep</p>
          </div>
        </Card>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t p-4">
        <div className="flex justify-around max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/home')} className="flex-col h-auto gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs">Shop</span>
          </Button>
          <Button variant="ghost" onClick={() => navigate('/orders')} className="flex-col h-auto gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs">Orders</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto gap-1 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
