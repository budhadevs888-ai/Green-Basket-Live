import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useApp } from '../context/AppContext';

export const CartScreen: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useApp();
  const navigate = useNavigate();

  const itemTotal = getCartTotal();
  const deliveryFee = itemTotal >= 500 ? 0 : 40;
  const totalAmount = itemTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b p-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Your Cart</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-12 text-center max-w-md w-full">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to get started</p>
            <Button
              onClick={() => navigate('/home')}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Shopping
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/home')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Your Cart</h1>
        <span className="text-sm text-gray-500">({cart.length} items)</span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {cart.map(item => (
          <Card key={item.product.id} className="p-4">
            <div className="flex gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.unit}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="font-bold text-gray-900">₹{item.product.price * item.quantity}</p>
                  
                  <div className="flex items-center gap-2 border rounded-lg">
                    <Button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      size="sm"
                      variant="ghost"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      size="sm"
                      variant="ghost"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="m-4 mt-0 p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Bill Summary</h3>
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

          {itemTotal < 500 && (
            <p className="text-xs text-green-600">Add ₹{500 - itemTotal} more for free delivery</p>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Payment Method:</span> Cash on Delivery
            </p>
          </div>
        </div>
      </Card>

      <div className="bg-white border-t p-4">
        <Button
          onClick={() => navigate('/order-confirm')}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};
