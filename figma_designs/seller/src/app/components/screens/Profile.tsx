import React from 'react';
import { MapPin, Phone, Store, CheckCircle, CreditCard, Package, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { SellerState } from '../../App';

interface ProfileProps {
  sellerState: SellerState;
  onLogout: () => void;
}

export default function Profile({ sellerState, onLogout }: ProfileProps) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your shop information and settings
        </p>
      </div>

      <div className="max-w-3xl">
        {/* Shop Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Store className="w-6 h-6" />
                  <h2 className="text-xl font-bold">{sellerState.shopName}</h2>
                </div>
                <p className="text-green-100 text-sm">Seller ID: SEL-789456</p>
              </div>
              <Badge className="bg-white text-green-700 border-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Phone Number</div>
                <div className="font-medium text-gray-900">{sellerState.phoneNumber}</div>
                <div className="text-xs text-gray-500 mt-1">(Read-only)</div>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Registered Location</div>
                <div className="font-medium text-gray-900">{sellerState.location}</div>
                <div className="text-xs text-gray-500 mt-1">(Cannot be edited)</div>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Approval Status</div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Approved
                </Badge>
                <div className="text-xs text-gray-500 mt-1">Active since Jan 15, 2026</div>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Bank Account</div>
                <div className="font-medium text-gray-900">HDFC Bank •••• 4567</div>
                <button className="text-xs text-green-600 hover:text-green-700 mt-1">
                  Request change
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Categories</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Vegetables</Badge>
                  <Badge variant="outline">Fruits</Badge>
                  <Badge variant="outline">Dairy</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Preview */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Shop Location</h3>
          </div>
          <div className="p-6">
            {/* Mock map placeholder */}
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{sellerState.location}</p>
                <p className="text-xs text-gray-400 mt-1">Verified location on map</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Member Since</div>
                <div className="text-sm text-gray-500">January 15, 2026</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Total Orders Fulfilled</div>
                <div className="text-sm text-gray-500">247 orders</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Compliance Rating</div>
                <div className="text-sm text-gray-500">85% (Good)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
