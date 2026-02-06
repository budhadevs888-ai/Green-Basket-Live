// Mock data for the admin panel
import { Seller, DeliveryPartner, Order, Earning, AuditLog, ActivityItem, DashboardMetrics, User } from './types';

export const mockDashboardMetrics: DashboardMetrics = {
  totalOrders: 156,
  activeOrders: 23,
  deliveredOrders: 133,
  activeSellers: 45,
  activeDeliveryPartners: 28,
  pendingApprovals: 7
};

export const mockRecentActivity: ActivityItem[] = [
  { id: '1', type: 'seller_approved', message: 'Fresh Vegetables Store approved', timestamp: '2 minutes ago' },
  { id: '2', type: 'order_delivered', message: 'Order #1234 delivered successfully', timestamp: '5 minutes ago' },
  { id: '3', type: 'delivery_assigned', message: 'Delivery partner assigned to Order #1235', timestamp: '8 minutes ago' },
  { id: '4', type: 'seller_suspended', message: 'Quick Mart suspended for policy violation', timestamp: '15 minutes ago' },
  { id: '5', type: 'order_delivered', message: 'Order #1232 delivered successfully', timestamp: '22 minutes ago' },
];

export const mockSellers: Seller[] = [
  {
    id: 'S001',
    shopName: 'Fresh Vegetables Store',
    phone: '+1234567890',
    location: 'Downtown Market, Block A',
    status: 'pending',
    registrationDate: '2026-02-05',
    documents: ['business_license.pdf', 'tax_certificate.pdf'],
    categories: ['Vegetables', 'Fruits']
  },
  {
    id: 'S002',
    shopName: 'Quick Mart',
    phone: '+1234567891',
    location: 'Main Street, Shop 15',
    status: 'approved',
    registrationDate: '2026-01-20',
    categories: ['Groceries', 'Daily Essentials']
  },
  {
    id: 'S003',
    shopName: 'Organic Delights',
    phone: '+1234567892',
    location: 'Green Plaza, Unit 8',
    status: 'approved',
    registrationDate: '2026-01-15',
    categories: ['Organic Products', 'Health Food']
  },
  {
    id: 'S004',
    shopName: 'City Supermarket',
    phone: '+1234567893',
    location: 'City Center, Building 3',
    status: 'suspended',
    registrationDate: '2026-01-10',
    categories: ['Groceries', 'Household']
  },
  {
    id: 'S005',
    shopName: 'Green Basket Local',
    phone: '+1234567894',
    location: 'West Avenue, Shop 22',
    status: 'pending',
    registrationDate: '2026-02-06',
    documents: ['business_license.pdf'],
    categories: ['Vegetables', 'Groceries']
  }
];

export const mockDeliveryPartners: DeliveryPartner[] = [
  {
    id: 'D001',
    name: 'John Doe',
    phone: '+1234567895',
    location: 'Downtown Area',
    availability: 'available',
    status: 'approved',
    registrationDate: '2026-01-25'
  },
  {
    id: 'D002',
    name: 'Jane Smith',
    phone: '+1234567896',
    location: 'North District',
    availability: 'busy',
    status: 'approved',
    registrationDate: '2026-01-22'
  },
  {
    id: 'D003',
    name: 'Mike Wilson',
    phone: '+1234567897',
    location: 'East Side',
    availability: 'offline',
    status: 'pending',
    registrationDate: '2026-02-04'
  },
  {
    id: 'D004',
    name: 'Sarah Johnson',
    phone: '+1234567898',
    location: 'South Area',
    availability: 'available',
    status: 'approved',
    registrationDate: '2026-01-18'
  },
  {
    id: 'D005',
    name: 'Tom Brown',
    phone: '+1234567899',
    location: 'Central District',
    availability: 'suspended',
    status: 'suspended',
    registrationDate: '2026-01-12'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD1234',
    customerLocation: '123 Main St, Apt 4B',
    seller: 'Quick Mart',
    deliveryPartner: 'John Doe',
    status: 'out_for_delivery',
    createdAt: '2026-02-06 09:30:00',
    amount: 45.50
  },
  {
    id: 'ORD1235',
    customerLocation: '456 Oak Avenue',
    seller: 'Organic Delights',
    deliveryPartner: 'Jane Smith',
    status: 'preparing',
    createdAt: '2026-02-06 10:15:00',
    amount: 78.20
  },
  {
    id: 'ORD1236',
    customerLocation: '789 Pine Street',
    seller: 'Fresh Vegetables Store',
    deliveryPartner: 'Sarah Johnson',
    status: 'delivered',
    createdAt: '2026-02-06 08:00:00',
    amount: 32.75
  },
  {
    id: 'ORD1237',
    customerLocation: '321 Elm Road',
    seller: 'Quick Mart',
    deliveryPartner: 'John Doe',
    status: 'confirmed',
    createdAt: '2026-02-06 11:20:00',
    amount: 55.00
  },
  {
    id: 'ORD1238',
    customerLocation: '654 Maple Drive',
    seller: 'Organic Delights',
    deliveryPartner: 'Jane Smith',
    status: 'delivered',
    createdAt: '2026-02-05 16:45:00',
    amount: 92.30
  }
];

export const mockEarnings: Earning[] = [
  {
    id: 'E001',
    userId: 'S002',
    userName: 'Quick Mart',
    role: 'seller',
    orderId: 'ORD1234',
    amount: 40.95,
    status: 'pending',
    date: '2026-02-06'
  },
  {
    id: 'E002',
    userId: 'D001',
    userName: 'John Doe',
    role: 'delivery',
    orderId: 'ORD1234',
    amount: 4.55,
    status: 'pending',
    date: '2026-02-06'
  },
  {
    id: 'E003',
    userId: 'S003',
    userName: 'Organic Delights',
    role: 'seller',
    orderId: 'ORD1238',
    amount: 83.07,
    status: 'paid',
    date: '2026-02-05'
  },
  {
    id: 'E004',
    userId: 'D002',
    userName: 'Jane Smith',
    role: 'delivery',
    orderId: 'ORD1238',
    amount: 9.23,
    status: 'paid',
    date: '2026-02-05'
  },
  {
    id: 'E005',
    userId: 'S001',
    userName: 'Fresh Vegetables Store',
    role: 'seller',
    orderId: 'ORD1236',
    amount: 29.48,
    status: 'paid',
    date: '2026-02-06'
  }
];

export const mockUsers: User[] = [
  {
    id: 'U001',
    phone: '+1234567890',
    role: 'seller',
    status: 'approved',
    lastActive: '2026-02-06 11:30:00'
  },
  {
    id: 'U002',
    phone: '+1234567891',
    role: 'seller',
    status: 'approved',
    lastActive: '2026-02-06 10:45:00'
  },
  {
    id: 'U003',
    phone: '+1234567895',
    role: 'delivery',
    status: 'approved',
    lastActive: '2026-02-06 11:25:00'
  },
  {
    id: 'U004',
    phone: '+9876543210',
    role: 'customer',
    status: 'approved',
    lastActive: '2026-02-06 09:15:00'
  },
  {
    id: 'U005',
    phone: '+1234567899',
    role: 'delivery',
    status: 'suspended',
    lastActive: '2026-02-05 18:20:00'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'A001',
    timestamp: '2026-02-06 11:30:45',
    actorRole: 'admin',
    actorId: 'ADM001',
    action: 'Approved Seller',
    entity: 'Seller',
    entityId: 'S001'
  },
  {
    id: 'A002',
    timestamp: '2026-02-06 11:15:30',
    actorRole: 'admin',
    actorId: 'ADM001',
    action: 'Suspended Seller',
    entity: 'Seller',
    entityId: 'S004'
  },
  {
    id: 'A003',
    timestamp: '2026-02-06 10:50:20',
    actorRole: 'seller',
    actorId: 'S002',
    action: 'Updated Order Status',
    entity: 'Order',
    entityId: 'ORD1234'
  },
  {
    id: 'A004',
    timestamp: '2026-02-06 10:30:15',
    actorRole: 'delivery',
    actorId: 'D001',
    action: 'Accepted Delivery',
    entity: 'Order',
    entityId: 'ORD1234'
  },
  {
    id: 'A005',
    timestamp: '2026-02-06 09:45:10',
    actorRole: 'admin',
    actorId: 'ADM001',
    action: 'Approved Delivery Partner',
    entity: 'DeliveryPartner',
    entityId: 'D001'
  }
];

export const mockAdmin = {
  id: 'ADM001',
  name: 'Admin User',
  phone: '+1234567800',
  role: 'admin' as const,
  lastLogin: '2026-02-06 08:00:00'
};
