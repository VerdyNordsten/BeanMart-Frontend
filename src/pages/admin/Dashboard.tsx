import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";
import { AdminDashboardHeader } from "@/features/admin/dashboard/AdminDashboardHeader";
import { AdminKPICards } from "@/features/admin/dashboard/AdminKPICards";
import { OrderStatusOverview } from "@/features/admin/dashboard/OrderStatusOverview";
import { QuickActions } from "@/features/admin/dashboard/QuickActions";


export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateRange, setDateRange] = useState(searchParams.get('range') || "30");

  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders', dateRange],
    queryFn: () => ordersApi.getAllOrders({ limit: 1000 }), // Get all orders for aggregation
  });

  // Update URL when date range changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('range', dateRange);
    setSearchParams(params);
  }, [dateRange, searchParams, setSearchParams]);

  // Calculate KPIs
  const calculateKPIs = () => {
    if (!ordersData?.data?.orders) return null;

    const now = new Date();
    const daysAgo = new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
    
    const filteredOrders = ordersData.data.orders.filter((order: unknown) => {
      const orderData = order as { created_at: string };
      return new Date(orderData.created_at) >= daysAgo;
    });

    const statusCounts = filteredOrders.reduce((acc: Record<string, number>, order: unknown) => {
      const orderData = order as { status: string; total_amount?: string | number };
      acc[orderData.status] = (acc[orderData.status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      acc.revenue = (acc.revenue || 0) + parseFloat(String(orderData.total_amount || 0));
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

  return (
    <div className="space-y-6">
      <AdminDashboardHeader 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />

      <AdminKPICards kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusOverview kpis={kpis} />
        <QuickActions />
      </div>
    </div>
  );
}