import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => { api.get('/api/admin/users').then(r => { setUsers(r.data.users || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchUsers(); }, []);

  const handleSuspend = async (id) => { try { await api.post(`/api/admin/users/${id}/suspend`, { reason: 'Admin action' }); fetchUsers(); } catch {} };
  const handleReactivate = async (id) => { try { await api.post(`/api/admin/users/${id}/reactivate`); fetchUsers(); } catch {} };

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  const roles = ['all', 'CUSTOMER', 'SELLER', 'DELIVERY', 'ADMIN'];
  const getFiltered = (role) => role === 'all' ? users : users.filter(u => u.role === role);

  const UserTable = ({ list }) => (
    <div className="bg-white rounded-xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="text-left px-6 py-4 text-sm font-semibold">Phone</th><th className="text-left px-6 py-4 text-sm font-semibold">Role</th><th className="text-left px-6 py-4 text-sm font-semibold">City</th><th className="text-left px-6 py-4 text-sm font-semibold">Status</th><th className="text-left px-6 py-4 text-sm font-semibold">Actions</th></tr></thead>
      <tbody className="divide-y">{list.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">No users</td></tr> : list.map(u => (
        <tr key={u.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm">{u.phone}</td><td className="px-6 py-4"><Badge>{u.role}</Badge></td><td className="px-6 py-4 text-sm">{u.city || 'N/A'}</td><td className="px-6 py-4"><Badge className={u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{u.status}</Badge></td>
          <td className="px-6 py-4"><div className="flex gap-2">{u.role !== 'ADMIN' && (u.status === 'ACTIVE' ? <Button size="sm" variant="outline" onClick={() => handleSuspend(u.id)} className="text-red-600" data-testid={`suspend-user-${u.id}`}><Ban className="w-4 h-4 mr-1" />Suspend</Button> : <Button size="sm" variant="outline" onClick={() => handleReactivate(u.id)} className="text-green-600" data-testid={`reactivate-user-${u.id}`}><CheckCircle className="w-4 h-4 mr-1" />Reactivate</Button>)}</div></td>
        </tr>))}</tbody></table></div></div>
  );

  return (
    <div className="p-6" data-testid="admin-users-screen">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">User Management</h1></div>
      <Tabs defaultValue="all"><TabsList className="mb-6">{roles.map(r => <TabsTrigger key={r} value={r}>{r === 'all' ? `All (${users.length})` : `${r} (${getFiltered(r).length})`}</TabsTrigger>)}</TabsList>
        {roles.map(r => <TabsContent key={r} value={r}><UserTable list={getFiltered(r)} /></TabsContent>)}
      </Tabs>
    </div>
  );
}
