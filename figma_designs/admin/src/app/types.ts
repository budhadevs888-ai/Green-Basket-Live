// Types for the admin panel

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type UserRole = 'customer' | 'seller' | 'delivery' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type PayoutStatus = 'pending' | 'paid';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  status: ApprovalStatus;
  lastActive: string;
}

export interface Seller {
  id: string;
  shopName: string;
  phone: string;
  location: string;
  status: ApprovalStatus;
  registrationDate: string;
  documents?: string[];
  categories?: string[];
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  location: string;
  availability: 'available' | 'busy' | 'offline';
  status: ApprovalStatus;
  registrationDate: string;
}

export interface Order {
  id: string;
  customerLocation: string;
  seller: string;
  deliveryPartner: string;
  status: OrderStatus;
  createdAt: string;
  amount: number;
}

export interface Earning {
  id: string;
  userId: string;
  userName: string;
  role: 'seller' | 'delivery';
  orderId: string;
  amount: number;
  status: PayoutStatus;
  date: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
}

export interface ActivityItem {
  id: string;
  type: 'seller_approved' | 'order_delivered' | 'delivery_assigned' | 'seller_suspended';
  message: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalOrders: number;
  activeOrders: number;
  deliveredOrders: number;
  activeSellers: number;
  activeDeliveryPartners: number;
  pendingApprovals: number;
}
