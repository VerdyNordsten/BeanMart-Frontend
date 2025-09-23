import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ordersApi } from '@/lib/api';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';

const dateRanges = [
  { label: 'Last 7 days', value: '7', days: 7 },
  { label: 'Last 30 days', value: '30', days: 30 },
  { label: 'Last 90 days', value: '90', days: 90 },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-500' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-500' },
};

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateRange, setDateRange] = useState(searchParams.get('range') || '30');

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', dateRange],
    queryFn: () => ordersApi.getOrders({ limit: 1000 }), // Get all orders for aggregation
  });

  // Update URL when date range changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('range', dateRange);
    setSearchParams(params);
  }, [dateRange, searchParams, setSearchParams]);

  // Calculate KPIs
  const calculateKPIs = () => {
    if (!ordersData?.orders) return null;

    const now = new Date();
    const daysAgo = new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
    
    const filteredOrders = ordersData.orders.filter((order: any) => 
      new Date(order.created_at) >= daysAgo
    );

    const statusCounts = filteredOrders.reduce((acc: any, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      acc.revenue = (acc.revenue || 0) + parseFloat(order.total_amount || 0);
      return acc;
    }, {});

    return {
      totalOrders: statusCounts.total || 0,
      revenue: statusCounts.revenue || 0,
      pending: statusCounts.pending || 0,
      confirmed: statusCounts.confirmed || 0,
      shipped: statusCounts.shipped || 0,
      delivered: statusCounts.delivered || 0,
      cancelled: statusCounts.cancelled || 0,
    };
  };

  const kpis = calculateKPIs();

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    color = 'bg-coffee-medium' 
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    color?: string;
  }) => (
    <Card className="card-shadow hover:warm-shadow smooth-transition">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-coffee-dark">
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{change}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-display text-3xl font-bold text-coffee-dark">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-bold text-coffee-dark">Dashboard</h1>
        
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={kpis?.totalOrders || 0}
          icon={ShoppingCart}
          color="bg-coffee-medium"
        />
        
        <StatCard
          title="Revenue"
          value={`$${(kpis?.revenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        
        <StatCard
          title="Pending Orders"
          value={kpis?.pending || 0}
          icon={Clock}
          color="bg-yellow-500"
        />
        
        <StatCard
          title="Delivered"
          value={kpis?.delivered || 0}
          icon={CheckCircle}
          color="bg-green-600"
        />
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="font-display text-xl text-coffee-dark">
              Order Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusConfig).map(([status, config]) => {
                const Icon = config.icon;
                const count = kpis?.[status as keyof typeof kpis] || 0;
                const percentage = kpis?.totalOrders 
                  ? Math.round((count / kpis.totalOrders) * 100) 
                  : 0;
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${config.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-coffee-dark">
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{count}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="font-display text-xl text-coffee-dark">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/products"
                className="flex items-center p-3 rounded-lg border hover:bg-muted smooth-transition"
              >
                <Package className="h-5 w-5 text-coffee-medium mr-3" />
                <span className="font-medium">Manage Products</span>
              </a>
              
              <a
                href="/admin/orders"
                className="flex items-center p-3 rounded-lg border hover:bg-muted smooth-transition"
              >
                <ShoppingCart className="h-5 w-5 text-coffee-medium mr-3" />
                <span className="font-medium">View Orders</span>
              </a>
              
              <a
                href="/admin/users"
                className="flex items-center p-3 rounded-lg border hover:bg-muted smooth-transition"
              >
                <CheckCircle className="h-5 w-5 text-coffee-medium mr-3" />
                <span className="font-medium">Manage Users</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}