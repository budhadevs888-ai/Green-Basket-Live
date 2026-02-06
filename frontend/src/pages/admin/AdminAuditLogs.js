import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/api/admin/audit-logs').then(r => { setLogs(r.data.logs || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  const getActionBadge = (action) => {
    if (action.includes('APPROVED')) return 'bg-green-100 text-green-700';
    if (action.includes('REJECTED') || action.includes('SUSPENDED')) return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-6" data-testid="admin-audit-logs-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1><p className="text-sm text-gray-500 mt-1">Immutable system event logs</p></div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="text-left px-6 py-4 text-sm font-semibold">Time</th><th className="text-left px-6 py-4 text-sm font-semibold">Action</th><th className="text-left px-6 py-4 text-sm font-semibold">Actor Role</th><th className="text-left px-6 py-4 text-sm font-semibold">Details</th></tr></thead>
          <tbody className="divide-y">{logs.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-gray-500">No logs</td></tr> : logs.map(log => (
            <tr key={log.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td><td className="px-6 py-4"><Badge className={getActionBadge(log.action)}>{log.action}</Badge></td><td className="px-6 py-4"><Badge variant="outline">{log.actor_role}</Badge></td><td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{log.details}</td></tr>
          ))}</tbody></table></div>
      </div>
    </div>
  );
}
