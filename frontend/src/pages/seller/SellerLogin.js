import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';

export default function SellerLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { sendOtp, login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await login(phone, otp, 'SELLER');
      navigate(result.redirect || '/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" data-testid="seller-login-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <ShoppingBasket className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Seller Login</h1>
          <p className="text-sm text-gray-500">Green Basket Seller Panel</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                data-testid="seller-phone-input"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={otpSent || loading}
                className="mt-1.5"
              />
            </div>

            {!otpSent && (
              <Button
                data-testid="seller-send-otp-btn"
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : 'Send OTP'}
              </Button>
            )}

            {otpSent && (
              <>
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    data-testid="seller-otp-input"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-gray-400 mt-1">Dev mode: use 123456</p>
                </div>
                <Button
                  data-testid="seller-verify-otp-btn"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify & Login'}
                </Button>
                <Button variant="outline" onClick={() => { setOtpSent(false); setOtp(''); }} className="w-full">
                  Change Number
                </Button>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg" data-testid="seller-login-error">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">Seller access is invite-only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
