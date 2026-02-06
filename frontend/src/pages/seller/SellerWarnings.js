import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function SellerWarnings() {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/seller/warnings').then(r => { setWarnings(r.data.warnings || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  const getSeverityBadge = (s) => {
    const map = { high: <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>, medium: <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>, low: <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low</Badge> };
    return map[s] || null;
  };

  const getSeverityIcon = (s) => {
    if (s === 'high') return <XCircle className="w-5 h-5 text-red-600" />;
    if (s === 'medium') return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    return <AlertCircle className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="p-6" data-testid="seller-warnings-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Warnings & Compliance</h1><p className="text-sm text-gray-500 mt-1">Track your compliance status</p></div>

      {warnings.length >= 3 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6 flex items-start gap-3">
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div><h3 className="font-semibold text-red-900 mb-1">Next violation may lead to suspension</h3><p className="text-sm text-red-700">You have {warnings.length} active warnings.</p></div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200"><h2 className="font-semibold text-gray-900">Warning History</h2></div>
        <div className="divide-y divide-gray-200">
          {warnings.length === 0 ? (
            <div className="p-12 text-center"><AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No warnings</p><p className="text-sm text-gray-400 mt-1">Keep up the good work!</p></div>
          ) : warnings.map(w => (
            <div key={w.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getSeverityIcon(w.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2"><h3 className="font-semibold text-gray-900">{w.reason}</h3>{getSeverityBadge(w.severity)}</div>
                  <p className="text-sm text-gray-600 mb-2">{w.description}</p>
                  <p className="text-xs text-gray-500">{new Date(w.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 className="font-semibold text-blue-900 mb-3">Policy Guidelines</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">&#8226;</span><span>Confirm daily stock before 9:00 AM</span></li>
          <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">&#8226;</span><span>Accept assigned orders within 5 minutes</span></li>
          <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">&#8226;</span><span>Mark orders as ready within 20 minutes</span></li>
          <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">&#8226;</span><span>Maintain accurate stock levels</span></li>
        </ul>
      </div>
    </div>
  );
}
