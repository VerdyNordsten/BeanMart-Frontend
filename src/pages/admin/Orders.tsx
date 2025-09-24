import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { ordersApi } from '@/lib/api';
import { formatAPIError } from '@/lib/api-client';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500 text-white' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-500 text-white' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-500 text-white' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-500 text-white' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-500 text-white' },
};

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [selectedOrder, setSelectedOrder] = useState<unknown>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // Fetch orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', page, limit, searchQuery, statusFilter],
    queryFn: () => ordersApi.getOrders({
      page,
      limit,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
    }),
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Order updated",
        description: "The order status has been successfully updated.",
      });
    },
    onError: (error) => {
      const apiError = formatAPIError(error);
      toast({
        title: "Update failed",
        description: apiError.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    setSearchParams(params);
    setStatusFilter(status === 'all' ? '' : status);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await ordersApi.getOrder(orderId);
      setSelectedOrder(order);
      setShowOrderDetail(true);
    } catch (error) {
      const apiError = formatAPIError(error);
      toast({
        title: "Failed to load order",
        description: apiError.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-display text-3xl font-bold text-coffee-dark">Orders</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || { page: 1, limit: 10, total: 0, total_pages: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-coffee-dark">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer orders and track fulfillment
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button type="submit" variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </form>
            
            <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-coffee-medium" />
            Orders ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg text-coffee-dark mb-2">
                No orders found
              </h3>
              <p className="text-muted-foreground">
                Orders will appear here when customers make purchases.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: unknown) => {
                    const orderData = order as {
                      id: string;
                      status: string;
                      total_amount: string | number;
                      created_at: string;
                      user: { full_name: string; email: string };
                      shipping_address: { street_address: string; city: string; state: string; postal_code: string };
                    };
                    const statusInfo = statusConfig[orderData.status as keyof typeof statusConfig];
                    const StatusIcon = statusInfo?.icon || Clock;
                    
                    return (
                      <TableRow key={orderData.id}>
                        <TableCell>
                          <div className="font-mono text-sm">
                            #{orderData.id.slice(-8).toUpperCase()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {orderData.user.full_name || 'Unknown Customer'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {orderData.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${parseFloat(String(orderData.total_amount || 0)).toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={statusInfo?.color || 'bg-gray-500 text-white'}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo?.label || orderData.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(orderData.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewOrder(orderData.id)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              
                              {Object.entries(statusConfig).map(([status, config]) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => updateStatusMutation.mutate({ 
                                    id: orderData.id, 
                                    status 
                                  })}
                                  className="gap-2"
                                  disabled={orderData.status === status}
                                >
                                  <config.icon className="h-4 w-4" />
                                  Mark as {config.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} orders
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                      const pageNum = pagination.page - 2 + i;
                      if (pageNum < 1 || pageNum > pagination.total_pages) return null;
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "coffee" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.total_pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Sheet */}
      <Sheet open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle className="font-display text-xl text-coffee-dark">
              Order Details
            </SheetTitle>
          </SheetHeader>
          
          {selectedOrder && (
            <div className="mt-6 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Order ID</div>
                      <div className="font-mono">#{selectedOrder.id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div>{new Date(selectedOrder.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge className={statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color}>
                        {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-semibold">${parseFloat(selectedOrder.total_amount || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Name: </span>
                      <span>{selectedOrder.customer_name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email: </span>
                      <span>{selectedOrder.customer_email || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              {(selectedOrder.shipping_address || selectedOrder.billing_address) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Addresses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedOrder.shipping_address && (
                        <div>
                          <div className="font-medium mb-2">Shipping Address</div>
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {JSON.stringify(selectedOrder.shipping_address, null, 2)}
                          </pre>
                        </div>
                      )}
                      {selectedOrder.billing_address && (
                        <div>
                          <div className="font-medium mb-2">Billing Address</div>
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {JSON.stringify(selectedOrder.billing_address, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item: unknown, index: number) => {
                        const itemData = item as {
                          product_name?: string;
                          name?: string;
                          quantity: number;
                          price: number;
                        };
                        return (
                        <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                          <div>
                            <div className="font-medium">{itemData.product_name || itemData.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Qty: {itemData.quantity} × ${itemData.price}
                            </div>
                          </div>
                          <div className="font-medium">
                            ${(itemData.quantity * itemData.price).toFixed(2)}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}