import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, MapPin, CreditCard, User } from 'lucide-react';

interface StatsCardsProps {
  ordersCount: number;
  addressesCount: number;
  ordersLoading: boolean;
  addressesLoading: boolean;
}

export function StatsCards({ ordersCount, addressesCount, ordersLoading, addressesLoading }: StatsCardsProps) {
  return (
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
            <div className="text-2xl font-bold">{ordersCount}</div>
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
            <div className="text-2xl font-bold">{addressesCount}</div>
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
  );
}
