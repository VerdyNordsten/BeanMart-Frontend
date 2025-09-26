import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ShoppingBag, MapPin, CreditCard, User } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { userAddressesApi } from "@/lib/api";

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
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.first_name || "Customer"}!</h1>
        <p className="text-muted-foreground">
          Manage your account, orders, and preferences
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="h-6 w-8 bg-muted rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold">{orders.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              View your recent orders
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/user/orders">View all orders</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {addressesLoading ? (
              <div className="h-6 w-8 bg-muted rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold">{addresses.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Shipping addresses
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/user/addresses">Manage addresses</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Saved payment methods
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/user/payment-methods">Add payment method</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Account status
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/user/profile">View profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Your most recent purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-muted rounded"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Order {order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: order.currency || "USD",
                      }).format(order.total_amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
                <p>No orders yet</p>
                <p className="text-sm mt-2">
                  Start shopping to see your orders here
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/catalog">Shop now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your profile details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span>
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString() 
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account status</span>
                  <span className={user?.is_active ? "text-green-600" : "text-red-600"}>
                    {user?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}