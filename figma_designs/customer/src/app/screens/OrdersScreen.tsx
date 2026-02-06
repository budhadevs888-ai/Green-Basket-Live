import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

export const OrdersScreen: React.FC = () => {
  const { orders } = useApp();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusMap = {
      placed: { label: 'Placed', className: 'bg-blue-100 text-blue-700' },
      preparing: { label: 'Preparing', className: 'bg-amber-100 text-amber-700' },
      out_for_delivery: { label: 'Out for Delivery', className: 'bg-purple-100 text-purple-700' },
      delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700' },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.placed;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/home')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">My Orders</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-12 text-center max-w-md">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">
                Start shopping to place your first order
              </p>
              <Button
                onClick={() => navigate('/home')}
                className="bg-green-600 hover:bg-green-700"
              >
                Start Shopping
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const statusInfo = getStatusBadge(order.status);
              return (
                <Card
                  key={order.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/order-tracking/${order.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.date), 'MMM dd, yyyy • h:mm a')}
                      </p>
                    </div>
                    <Badge className={statusInfo.className}>
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {order.items.slice(0, 3).map(item => (
                      <img
                        key={item.product.id}
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                    <p className="font-bold text-gray-900">₹{order.total}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t p-4">
        <div className="flex justify-around max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/home')} className="flex-col h-auto gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs">Shop</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto gap-1 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs">Orders</span>
          </Button>
          <Button variant="ghost" onClick={() => navigate('/profile')} className="flex-col h-auto gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};