import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules/card';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Textarea } from '@/components/atoms/textarea';
import { Separator } from '@/components/molecules/separator';
import { useCartStore } from '@/lib/cart';
import { useAuthStore } from '@/lib/auth';
import { formatPrice } from '@/utils/currency';
import { ordersApi, userAddressesApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingCart, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  Package,
  Truck,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Indonesia'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [useExistingAddress, setUseExistingAddress] = useState(true);

  // Fetch user addresses
  const { data: addressesResponse, error: addressesError } = useQuery({
    queryKey: ['user-addresses'],
    queryFn: () => userAddressesApi.getUserAddresses(),
    enabled: isAuthenticated,
    retry: 1
  });

  const addresses = useMemo(() => addressesResponse?.data || [], [addressesResponse]);
  const hasAddresses = addresses.length > 0;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      navigate('/products');
      return;
    }
  }, [isAuthenticated, items.length, navigate]);

  // Handle address selection
  useEffect(() => {
    if (hasAddresses && useExistingAddress) {
      const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setShippingAddress({
          fullName: defaultAddress.recipient_name || '',
          phone: defaultAddress.phone || '',
          address: `${defaultAddress.address_line1}${defaultAddress.address_line2 ? ', ' + defaultAddress.address_line2 : ''}`,
          city: defaultAddress.city || '',
          state: defaultAddress.state || '',
          postalCode: defaultAddress.postal_code || '',
          country: defaultAddress.country || 'Indonesia'
        });
      }
    } else if (user && !useExistingAddress) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.full_name || '',
        phone: user.phone || ''
      }));
    }
  }, [hasAddresses, useExistingAddress, addresses, user]);

  // Handle address change
  const handleAddressChange = (addressId: string) => {
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setSelectedAddressId(addressId);
      setShippingAddress({
        fullName: selectedAddress.recipient_name || '',
        phone: selectedAddress.phone || '',
        address: `${selectedAddress.address_line1}${selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''}`,
        city: selectedAddress.city || '',
        state: selectedAddress.state || '',
        postalCode: selectedAddress.postal_code || '',
        country: selectedAddress.country || 'Indonesia'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productVariantId: item.variant.id,
          quantity: item.quantity,
          pricePerUnit: Number(item.price),
          totalPrice: Number(item.price) * item.quantity
        })),
        shippingAddress: {
          ...shippingAddress,
          type: 'shipping'
        },
        billingAddress: {
          ...shippingAddress,
          type: 'billing'
        },
        notes: notes,
        shippingCost: shipping
      };

      console.log('Order data being sent:', orderData);
      console.log('Order data types:', {
        items: orderData.items.map(item => ({
          productVariantId: typeof item.productVariantId,
          quantity: typeof item.quantity,
          pricePerUnit: typeof item.pricePerUnit,
          totalPrice: typeof item.totalPrice
        }))
      });

      // Call actual order creation API
      const response = await ordersApi.createOrder(orderData);
      
      console.log('Order creation response:', response);
      
      if (response.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/user/orders');
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (items.length === 0) {
    return null; // Will redirect
  }

  const subtotal = getTotalPrice();
  const shipping = 5; // Fixed shipping cost
  const total = subtotal + shipping;
  
  console.log('Price calculations:', { subtotal, shipping, total });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
          <p className="text-muted-foreground">
            Complete your order and we'll prepare it for shipping
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>
                  Where should we deliver your order?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address Selection */}
                {hasAddresses && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="use_existing"
                        name="address_type"
                        checked={useExistingAddress}
                        onChange={() => setUseExistingAddress(true)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="use_existing" className="flex-1 cursor-pointer">
                        Use existing address
                      </Label>
                    </div>
                    
                    {useExistingAddress && (
                      <div className="ml-6">
                        <Label htmlFor="address_select">Select Address</Label>
                        <select
                          id="address_select"
                          value={selectedAddressId}
                          onChange={(e) => handleAddressChange(e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        >
                          {addresses.map((address) => (
                            <option key={address.id} value={address.id}>
                              {address.label || 'Address'} - {address.recipient_name} - {address.city}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="use_new"
                        name="address_type"
                        checked={!useExistingAddress}
                        onChange={() => setUseExistingAddress(false)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="use_new" className="flex-1 cursor-pointer">
                        Use new address
                      </Label>
                    </div>
                  </div>
                )}

                {addressesError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-800">
                      Failed to load addresses. Please try again later.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {!hasAddresses && !addressesError && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-sm text-yellow-800">
                      You don't have any saved addresses. Please create one first.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      asChild
                    >
                      <Link to="/user/addresses">Manage Addresses</Link>
                    </Button>
                  </div>
                )}

                {(!useExistingAddress || !hasAddresses) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Street address, building, apartment, etc."
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province *</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose how you'd like to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bank_transfer"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                      Bank Transfer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
                <CardDescription>
                  Any special instructions for your order?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special delivery instructions, gift message, etc."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.variant.weight_gram}g
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity, 'USD')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal, 'USD')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatPrice(shipping, 'USD')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total, 'USD')}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}