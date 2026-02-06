import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

export const OrderTrackingScreen: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useApp();
  const navigate = useNavigate();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b p-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Order Not Found</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">Order not found</p>
            <Button onClick={() => navigate('/orders')} variant="outline">
              Go to Orders
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'placed', label: 'Order Placed', icon: CheckCircle, completed: true },
    { key: 'preparing', label: 'Preparing', icon: Package, completed: order.status !== 'placed' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, completed: order.status === 'out_for_delivery' || order.status === 'delivered' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, completed: order.status === 'delivered' },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Track Order</h1>
          <p className="text-sm text-gray-500">{order.id}</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Order Status Timeline */}
        <Card className="p-6">
          <div className="space-y-6">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = step.completed;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 my-1 ${
                          step.completed ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pt-2">
                    <p
                      className={`font-medium ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isActive && (
                      <Badge className="mt-1 bg-green-100 text-green-700">
                        Current Status
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {order.estimatedDelivery && order.status !== 'delivered' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Estimated Delivery
                </p>
                <p className="text-sm text-green-700">
                  {format(new Date(order.estimatedDelivery), 'h:mm a')}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Delivery Address */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
              <p className="text-sm text-gray-600">
                {order.address.house}, {order.address.area}<br />
                {order.address.city} - {order.address.pincode}
              </p>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Order Items ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.product.unit} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Item Total</span>
              <span>₹{order.total - order.deliveryFee}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border-t p-4">
        <Button
          onClick={() => navigate('/home')}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};
