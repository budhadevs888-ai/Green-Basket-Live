import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Loader2, Wallet, CreditCard, Smartphone, Banknote, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

const deliverySlots = [
  { id: '1', label: 'Today, 6:00 PM - 8:00 PM', value: 'today-evening' },
  { id: '2', label: 'Tomorrow, 8:00 AM - 10:00 AM', value: 'tomorrow-morning' },
  { id: '3', label: 'Tomorrow, 12:00 PM - 2:00 PM', value: 'tomorrow-afternoon' },
  { id: '4', label: 'Tomorrow, 6:00 PM - 8:00 PM', value: 'tomorrow-evening' },
];

export const OrderConfirmScreen: React.FC = () => {
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'wallet'>('cod');
  const [deliverySlot, setDeliverySlot] = useState(deliverySlots[0].value);
  
  const { cart, location, getCartTotal, placeOrder, walletBalance } = useApp();
  const navigate = useNavigate();

  const itemTotal = getCartTotal();
  const deliveryFee = itemTotal >= 500 ? 0 : 40;
  const totalAmount = itemTotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!location) {
      toast.error('Please set delivery location');
      return;
    }

    if (paymentMethod === 'wallet' && walletBalance < totalAmount) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setPlacing(true);
    
    // Simulate order placement
    setTimeout(() => {
      const orderId = placeOrder(location, paymentMethod, deliverySlot);
      setPlacing(false);
      toast.success('Order placed successfully!');
      navigate(`/order-tracking/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/cart')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Confirm Order</h1>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {/* Delivery Address */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
              <p className="text-sm text-gray-600">
                {location?.house}, {location?.area}<br />
                {location?.city} - {location?.pincode}
              </p>
            </div>
          </div>
        </Card>

        {/* Delivery Slot */}
        <Card className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Clock className="w-5 h-5 text-gray-600 mt-1" />
            <h3 className="font-semibold text-gray-900">Select Delivery Slot</h3>
          </div>
          <RadioGroup value={deliverySlot} onValueChange={setDeliverySlot} className="space-y-2">
            {deliverySlots.map(slot => (
              <div key={slot.id} className="flex items-center space-x-2">
                <RadioGroupItem value={slot.value} id={slot.id} />
                <Label htmlFor={slot.id} className="flex-1 cursor-pointer">
                  {slot.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        {/* Payment Methods */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)} className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="cod" id="cod" />
              <Banknote className="w-5 h-5 text-gray-600" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when you receive</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="upi" id="upi" />
              <Smartphone className="w-5 h-5 text-gray-600" />
              <Label htmlFor="upi" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">UPI</p>
                  <p className="text-xs text-gray-500">PhonePe, Google Pay, Paytm</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="card" id="card" />
              <CreditCard className="w-5 h-5 text-gray-600" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, Rupay</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="wallet" id="wallet" />
              <Wallet className="w-5 h-5 text-gray-600" />
              <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">Wallet</p>
                  <p className="text-xs text-gray-500">Balance: ₹{walletBalance}</p>
                </div>
              </Label>
              {walletBalance < totalAmount && (
                <span className="text-xs text-red-600">Insufficient</span>
              )}
            </div>
          </RadioGroup>
        </Card>

        {/* Order Items */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Order Items ({cart.length})</h3>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.product.unit} × {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">₹{item.product.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Bill Summary */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Payment Summary</h3>
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Item Total</span>
              <span>₹{itemTotal}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="text-green-600 font-medium">FREE</span>
              ) : (
                <span>₹{deliveryFee}</span>
              )}
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total Payable</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border-t p-4 fixed bottom-0 left-0 right-0">
        <Button
          onClick={handlePlaceOrder}
          disabled={placing || (paymentMethod === 'wallet' && walletBalance < totalAmount)}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {placing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Placing Order...
            </>
          ) : (
            `Place Order - ₹${totalAmount}`
          )}
        </Button>
      </div>
    </div>
  );
};
