import React, { useState } from 'react';
import { Package, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface OrderItem {
  productName: string;
  unit: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  deliveryArea: string;
  status: 'assigned' | 'accepted' | 'ready';
  time: string;
  totalAmount: number;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-1234',
      items: [
        { productName: 'Tomatoes', unit: '1kg', quantity: 2, price: 40 },
        { productName: 'Onions', unit: '1kg', quantity: 1, price: 35 },
      ],
      deliveryArea: 'Sector 15, Market Road',
      status: 'assigned',
      time: '10 mins ago',
      totalAmount: 115,
    },
    {
      id: 'ORD-1235',
      items: [
        { productName: 'Potatoes', unit: '1kg', quantity: 3, price: 30 },
      ],
      deliveryArea: 'Sector 16, Main Street',
      status: 'assigned',
      time: '15 mins ago',
      totalAmount: 90,
    },
    {
      id: 'ORD-1230',
      items: [
        { productName: 'Carrots', unit: '500g', quantity: 2, price: 25 },
        { productName: 'Spinach', unit: '250g', quantity: 3, price: 20 },
      ],
      deliveryArea: 'Sector 15, Park Avenue',
      status: 'accepted',
      time: '1 hour ago',
      totalAmount: 110,
    },
    {
      id: 'ORD-1228',
      items: [
        { productName: 'Tomatoes', unit: '1kg', quantity: 1, price: 40 },
        { productName: 'Potatoes', unit: '1kg', quantity: 2, price: 30 },
      ],
      deliveryArea: 'Sector 14, Ring Road',
      status: 'ready',
      time: '2 hours ago',
      totalAmount: 100,
    },
  ]);

  const handleAccept = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'accepted' } : order
    ));
  };

  const handleMarkReady = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'ready' } : order
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Assigned</Badge>;
      case 'accepted':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Accepted</Badge>;
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
      default:
        return null;
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-green-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900">{order.id}</h3>
            {getStatusBadge(order.status)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{order.time}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-xl font-bold text-gray-900">₹{order.totalAmount}</div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{item.productName}</span>
              <span className="text-sm text-gray-500">({item.unit})</span>
            </div>
            <div className="text-sm text-gray-600">
              {item.quantity} × ₹{item.price}
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Info */}
      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg mb-4">
        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
        <span className="text-sm text-gray-700">{order.deliveryArea}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {order.status === 'assigned' && (
          <Button
            onClick={() => handleAccept(order.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Accept Order
          </Button>
        )}
        {order.status === 'accepted' && (
          <Button
            onClick={() => handleMarkReady(order.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Mark as Ready
          </Button>
        )}
        {order.status === 'ready' && (
          <div className="flex-1 text-center py-2 text-sm text-gray-500">
            Waiting for pickup
          </div>
        )}
      </div>
    </div>
  );

  const assignedOrders = orders.filter(o => o.status === 'assigned');
  const acceptedOrders = orders.filter(o => o.status === 'accepted');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and fulfill your orders
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="assigned">
            Assigned ({assignedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready ({readyOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          {assignedOrders.length > 0 ? (
            <div className="grid gap-4">
              {assignedOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No assigned orders</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted">
          {acceptedOrders.length > 0 ? (
            <div className="grid gap-4">
              {acceptedOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No accepted orders</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ready">
          {readyOrders.length > 0 ? (
            <div className="grid gap-4">
              {readyOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders ready for pickup</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
