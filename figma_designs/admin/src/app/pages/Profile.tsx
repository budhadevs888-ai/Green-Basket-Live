import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Phone, Shield, Clock, LogOut } from 'lucide-react';

export function Profile() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Admin Profile</h1>
        <p className="text-gray-600 mt-1">Your admin account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-700 p-3 rounded-full">
              <UserCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{admin.name}</h2>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 text-gray-600 p-2 rounded-lg mt-1">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-base text-gray-900 mt-1">{admin.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-gray-100 text-gray-600 p-2 rounded-lg mt-1">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-base text-gray-900 mt-1">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Admin
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-gray-100 text-gray-600 p-2 rounded-lg mt-1">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Login</label>
              <p className="text-base text-gray-900 mt-1">{admin.lastLogin}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Admin profile information cannot be edited from this interface. 
          Contact system administrators for any changes.
        </p>
      </div>
    </div>
  );
}
