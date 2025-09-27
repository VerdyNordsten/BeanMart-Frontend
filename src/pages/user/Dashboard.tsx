import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from "@/lib/auth";
import { ordersApi, userAddressesApi } from "@/lib/api";
import { DashboardHeader } from '@/components/user/dashboard/DashboardHeader';
import { StatsCards } from '@/components/user/dashboard/StatsCards';
import { RecentOrders } from '@/components/user/dashboard/RecentOrders';
import { AccountInfo } from '@/components/user/dashboard/AccountInfo';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
}

interface Address {
  id: string;
  label: string;
  is_default: boolean;
}

export default function UserDashboard() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);

  const fetchUserOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const response = await ordersApi.getUserOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchUserAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true);
      const response = await userAddressesApi.getUserAddresses(user!.id);
      if (response.success) {
        setAddresses(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setAddressesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && token) {
      fetchUserOrders();
      fetchUserAddresses();
    }
  }, [user, token, fetchUserOrders, fetchUserAddresses]);

  return (
    <div className="space-y-6">
      <DashboardHeader userName={user?.full_name} />
      
      <StatsCards 
        ordersCount={orders.length}
        addressesCount={addresses.length}
        ordersLoading={ordersLoading}
        addressesLoading={addressesLoading}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentOrders orders={orders} loading={ordersLoading} />
        <AccountInfo user={user} />
      </div>
    </div>
  );
}