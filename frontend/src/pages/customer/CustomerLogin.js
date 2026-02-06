import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';

export default function CustomerLogin() {
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
    try { const result = await login(phone, otp, 'CUSTOMER'); navigate(result.redirect || '/customer/home'); } catch (err) { setError(err.response?.data?.detail || 'Invalid OTP'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4" data-testid="customer-login-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-600 p-4 rounded-full mb-4"><ShoppingBasket className="w-12 h-12 text-white" /></div>
          <h1 className="text-3xl font-bold text-gray-900">Green Basket</h1>
          <p className="text-gray-600 mt-2">Fresh groceries at your doorstep</p>
        </div>
        <div className="space-y-6">
          <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" data-testid="customer-phone-input" type="tel" placeholder="Enter 10-digit phone number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} disabled={otpSent} className="mt-2" /></div>
          {!otpSent ? (
            <Button data-testid="customer-send-otp-btn" onClick={handleSendOTP} disabled={loading || phone.length !== 10} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending OTP...</> : 'Send OTP'}
            </Button>
          ) : (
            <>
              <div><Label htmlFor="otp">Enter OTP</Label><Input id="otp" data-testid="customer-otp-input" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2" /><p className="text-xs text-gray-400 mt-1">Dev mode: use 123456</p></div>
              <Button data-testid="customer-verify-otp-btn" onClick={handleVerify} disabled={loading || otp.length !== 6} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify & Continue'}
              </Button>
              <Button variant="outline" onClick={() => { setOtpSent(false); setOtp(''); }} className="w-full" disabled={loading}>Change Number</Button>
            </>
          )}
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-700">{error}</p></div>}
        </div>
      </div>
    </div>
  );
}
