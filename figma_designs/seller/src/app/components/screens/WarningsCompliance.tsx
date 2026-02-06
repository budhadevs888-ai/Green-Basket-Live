import React from 'react';
import { AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface Warning {
  id: string;
  date: string;
  reason: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export default function WarningsCompliance() {
  const warnings: Warning[] = [
    {
      id: '1',
      date: 'Feb 4, 2026',
      reason: 'Late Stock Confirmation',
      description: 'Daily stock was confirmed at 10:45 AM. Required time is before 9:00 AM.',
      severity: 'low',
    },
    {
      id: '2',
      date: 'Jan 28, 2026',
      reason: 'Order Rejection',
      description: 'Rejected 3 assigned orders due to stock unavailability. Ensure accurate stock levels.',
      severity: 'medium',
    },
    {
      id: '3',
      date: 'Jan 20, 2026',
      reason: 'Delayed Order Fulfillment',
      description: 'Order ORD-1045 was marked ready 35 minutes after acceptance. Standard time is 20 minutes.',
      severity: 'low',
    },
  ];

  const activeWarnings = warnings.filter(w => w.severity !== 'high');
  const warningCount = warnings.length;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low</Badge>;
      default:
        return null;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'low':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Warnings & Compliance</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your compliance status and violations
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-gray-600">Active Warnings</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">{warningCount}</div>
          <p className="text-sm text-gray-500 mt-2">Total warnings this month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Compliance Score</span>
          </div>
          <div className="text-3xl font-bold text-green-600">85%</div>
          <p className="text-sm text-gray-500 mt-2">Above minimum threshold</p>
        </div>
      </div>

      {/* Critical Alert */}
      {warningCount >= 3 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6 flex items-start gap-3">
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Next violation may lead to suspension</h3>
            <p className="text-sm text-red-700">
              You have {warningCount} active warnings. Accumulating more violations may result in 
              temporary account suspension. Please ensure compliance with all policies.
            </p>
          </div>
        </div>
      )}

      {/* Warnings List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Warning History</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {warnings.length > 0 ? (
            warnings.map((warning) => (
              <div key={warning.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(warning.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900">{warning.reason}</h3>
                      {getSeverityBadge(warning.severity)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{warning.description}</p>
                    <p className="text-xs text-gray-500">{warning.date}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No warnings</p>
              <p className="text-sm text-gray-400 mt-1">Keep up the good work!</p>
            </div>
          )}
        </div>
      </div>

      {/* Policy Guidelines */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 className="font-semibold text-blue-900 mb-3">Policy Guidelines</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Confirm daily stock before 9:00 AM every day</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Accept or reject assigned orders within 5 minutes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Mark orders as ready within 20 minutes of acceptance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Maintain accurate stock levels to avoid order rejections</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Respond to customer queries through admin within 2 hours</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
