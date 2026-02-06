import { useNavigate } from 'react-router';
import { mockDashboardMetrics, mockRecentActivity } from '../mockData';
import { 
  ShoppingCart, 
  Package, 
  CheckCircle, 
  Store, 
  Truck, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';

const metricCards = [
  {
    title: 'Total Orders (Today)',
    value: mockDashboardMetrics.totalOrders,
    icon: ShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    link: '/orders'
  },
  {
    title: 'Active Orders',
    value: mockDashboardMetrics.activeOrders,
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    link: '/orders'
  },
  {
    title: 'Delivered Orders',
    value: mockDashboardMetrics.deliveredOrders,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    link: '/orders'
  },
  {
    title: 'Active Sellers',
    value: mockDashboardMetrics.activeSellers,
    icon: Store,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    link: '/sellers'
  },
  {
    title: 'Active Delivery Partners',
    value: mockDashboardMetrics.activeDeliveryPartners,
    icon: Truck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    link: '/delivery-partners'
  },
  {
    title: 'Pending Approvals',
    value: mockDashboardMetrics.pendingApprovals,
    icon: Clock,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    link: '/sellers'
  },
];

const activityIcons = {
  seller_approved: CheckCircle,
  order_delivered: Package,
  delivery_assigned: Truck,
  seller_suspended: Activity,
};

const activityColors = {
  seller_approved: 'text-green-600',
  order_delivered: 'text-blue-600',
  delivery_assigned: 'text-indigo-600',
  seller_suspended: 'text-red-600',
};

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and monitoring</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((card) => {
          const Icon = card.icon;
          
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.link)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{card.title}</p>
                  <p className="text-3xl font-semibold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockRecentActivity.map((activity) => {
            const Icon = activityIcons[activity.type];
            const color = activityColors[activity.type];
            
            return (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`${color} mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
