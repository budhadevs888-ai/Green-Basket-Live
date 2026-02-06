import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import api from '../../utils/api';

export default function CustomerCart() {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('gb_cart')) || []; } catch { return []; } });
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const updateCart = (newCart) => { setCart(newCart); localStorage.setItem('gb_cart', JSON.stringify(newCart)); };
  const updateQty = (id, qty) => { if (qty <= 0) { updateCart(cart.filter(c => c.product_id !== id)); return; } updateCart(cart.map(c => c.product_id === id ? { ...c, quantity: qty } : c)); };
  const removeItem = (id) => updateCart(cart.filter(c => c.product_id !== id));

  const itemTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const deliveryFee = itemTotal >= 500 ? 0 : 40;
  const total = itemTotal + deliveryFee;

  const handleCheckout = async () => {
    setPlacing(true);
    try {
      let profile;
      try { profile = (await api.get('/api/customer/profile')).data; } catch { profile = {}; }
      const res = await api.post('/api/customer/cart/checkout', {
        items: cart.map(c => ({ product_id: c.product_id, quantity: c.quantity })),
        delivery_address: { house: profile.house || '', area: profile.area || '', city: profile.city || '', pincode: profile.pincode || '' },
        payment_method: 'COD'
      });
      localStorage.removeItem('gb_cart');
      navigate(`/customer/orders/${res.data.order.id}`);
    } catch (err) { alert(err.response?.data?.detail || 'Failed to place order'); }
    setPlacing(false);
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="customer-cart-empty">
      <div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/customer/home')}><ArrowLeft className="w-5 h-5" /></Button><h1 className="text-xl font-bold">Your Cart</h1></div>
      <div className="flex-1 flex items-center justify-center p-4"><div className="bg-white rounded-xl border p-12 text-center max-w-md w-full"><ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2><p className="text-gray-600 mb-6">Add items to get started</p><Button onClick={() => navigate('/customer/home')} className="bg-green-600 hover:bg-green-700">Start Shopping</Button></div></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="customer-cart-screen">
      <div className="bg-white border-b p-4 flex items-center gap-3"><Button variant="ghost" size="sm" onClick={() => navigate('/customer/home')}><ArrowLeft className="w-5 h-5" /></Button><h1 className="text-xl font-bold">Your Cart</h1><span className="text-sm text-gray-500">({cart.length} items)</span></div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-48">
        {cart.map(item => (
          <div key={item.product_id} className="bg-white rounded-xl border p-4" data-testid={`cart-item-${item.product_id}`}>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center text-2xl">🥬</div>
              <div className="flex-1">
                <div className="flex justify-between items-start"><div><h3 className="font-medium text-gray-900">{item.name}</h3><p className="text-sm text-gray-500">{item.unit}</p></div><Button variant="ghost" size="sm" onClick={() => removeItem(item.product_id)} className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button></div>
                <div className="flex items-center justify-between mt-3"><p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  <div className="flex items-center gap-2 border rounded-lg"><Button onClick={() => updateQty(item.product_id, item.quantity - 1)} size="sm" variant="ghost"><Minus className="w-4 h-4" /></Button><span className="font-medium w-8 text-center">{item.quantity}</span><Button onClick={() => updateQty(item.product_id, item.quantity + 1)} size="sm" variant="ghost"><Plus className="w-4 h-4" /></Button></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-xl border p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Bill Summary</h3>
          <hr />
          <div className="flex justify-between text-gray-600"><span>Item Total</span><span>₹{itemTotal}</span></div>
          <div className="flex justify-between text-gray-600"><span>Delivery Fee</span>{deliveryFee === 0 ? <span className="text-green-600 font-medium">FREE</span> : <span>₹{deliveryFee}</span>}</div>
          {itemTotal < 500 && <p className="text-xs text-green-600">Add ₹{500 - itemTotal} more for free delivery</p>}
          <hr />
          <div className="flex justify-between font-bold text-lg text-gray-900"><span>Total</span><span>₹{total}</span></div>
          <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-600"><span className="font-medium">Payment Method:</span> Cash on Delivery</p></div>
        </div>
      </div>
      <div className="bg-white border-t p-4 fixed bottom-0 left-0 right-0">
        <Button data-testid="place-order-btn" onClick={handleCheckout} disabled={placing} className="w-full bg-green-600 hover:bg-green-700" size="lg">
          {placing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Placing Order...</> : `Place Order - ₹${total}`}
        </Button>
      </div>
    </div>
  );
}
