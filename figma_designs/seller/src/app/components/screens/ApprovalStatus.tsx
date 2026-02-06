import React from 'react';
import { ShoppingBasket, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import type { SellerState } from '../../App';

interface ApprovalStatusProps {
  sellerState: SellerState;
  onLogout: () => void;
}

export default function ApprovalStatus({ sellerState, onLogout }: ApprovalStatusProps) {
  const steps = [
    {
      id: 'registration',
      label: 'Registration Submitted',
      status: 'completed',
    },
    {
      id: 'documents',
      label: 'Document Verification',
      status: sellerState.approvalStatus === 'PENDING' ? 'pending' : 'completed',
    },
    {
      id: 'location',
      label: 'Location Verification',
      status: sellerState.approvalStatus === 'LOCATION_VERIFICATION' ? 'active' : 
              sellerState.approvalStatus === 'APPROVED' ? 'completed' : 'pending',
    },
    {
      id: 'approval',
      label: 'Final Approval',
      status: sellerState.approvalStatus === 'APPROVED' ? 'completed' : 
              sellerState.approvalStatus === 'REJECTED' ? 'rejected' : 'pending',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'active':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <ShoppingBasket className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Approval Status</h1>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Your account is under review</p>
              <p className="text-sm text-amber-700 mt-1">
                We are verifying your documents and location. This usually takes 24-48 hours.
              </p>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6 border-l-2 border-gray-200 pl-6 ml-3 relative">
                  {index === steps.length - 1 && (
                    <div className="absolute left-0 top-6 bottom-0 w-0.5 bg-white"></div>
                  )}
                  <h3 className={`font-medium ${
                    step.status === 'completed' ? 'text-green-900' :
                    step.status === 'active' ? 'text-blue-900' :
                    step.status === 'rejected' ? 'text-red-900' :
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {step.status === 'completed' && 'Completed'}
                    {step.status === 'active' && 'In Progress'}
                    {step.status === 'rejected' && 'Rejected'}
                    {step.status === 'pending' && 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Shop Name</span>
              <span className="text-sm font-medium text-gray-900">{sellerState.shopName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Phone Number</span>
              <span className="text-sm font-medium text-gray-900">{sellerState.phoneNumber}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Registered Location</span>
              <span className="text-sm font-medium text-gray-900">{sellerState.location}</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          onClick={onLogout}
          variant="outline"
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
