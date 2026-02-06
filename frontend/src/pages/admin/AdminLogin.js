import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { sendOtp, login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) { setError('Please enter a valid 10-digit phone number'); return; }
    setLoading(true); setError('');
    try { await sendOtp(phone); setOtpSent(true); } catch (err) { setError(err.response?.data?.detail || 'Failed'); }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) { setError('Please enter a valid 6-digit OTP'); return; }
    setLoading(true); setError('');
    try { const result = await login(phone, otp, 'ADMIN'); navigate(result.redirect || '/admin/dashboard'); } catch (err) { setError(err.response?.data?.detail || 'Admin account not found'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4" data-testid="admin-login-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4"><Shield className="w-9 h-9 text-white" /></div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-sm text-slate-400">Green Basket Administration</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div><Label>Phone Number</Label><Input data-testid="admin-phone-input" type="tel" placeholder="Enter admin phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} disabled={otpSent} className="mt-1.5" /></div>
          {!otpSent ? <Button data-testid="admin-send-otp-btn" onClick={handleSendOTP} disabled={loading || phone.length !== 10} className="w-full bg-indigo-600 hover:bg-indigo-700">{loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : 'Send OTP'}</Button> : (
            <>
              <div><Label>Enter OTP</Label><Input data-testid="admin-otp-input" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-1.5" /><p className="text-xs text-gray-400 mt-1">Dev mode: use 123456</p></div>
              <Button data-testid="admin-verify-otp-btn" onClick={handleVerify} disabled={loading || otp.length !== 6} className="w-full bg-indigo-600 hover:bg-indigo-700">{loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify & Login'}</Button>
              <Button variant="outline" onClick={() => { setOtpSent(false); setOtp(''); }} className="w-full">Change Number</Button>
            </>
          )}
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-700">{error}</p></div>}
          <div className="pt-4 border-t"><p className="text-xs text-center text-gray-500">Admin accounts are pre-created only</p></div>
        </div>
      </div>
    </div>
  );
}
