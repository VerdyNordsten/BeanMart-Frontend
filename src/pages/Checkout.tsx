import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/lib/cart";
import { useAuthStore } from "@/lib/auth";
import { ordersApi, userAddressesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckoutHeader } from "@/features/checkout/CheckoutHeader";
import { ShippingAddressForm } from "@/features/checkout/ShippingAddressForm";
import { PaymentMethodForm } from "@/features/checkout/PaymentMethodForm";
import { OrderNotesForm } from "@/features/checkout/OrderNotesForm";
import { OrderSummary } from "@/features/checkout/OrderSummary";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  
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
  const { data: addressesResponse, isLoading: addressesLoading, error: addressesError } = useQuery({
    queryKey: ['user-addresses'],
    queryFn: () => userAddressesApi.getUserAddresses(),
    enabled: isAuthenticated,
    retry: 1
  });

  const addresses = useMemo(() => addressesResponse?.data || [], [addressesResponse?.data]);
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
          fullName: defaultAddress.recipient_name || "",
          phone: defaultAddress.phone || "",
          address: `${defaultAddress.address_line1}${defaultAddress.address_line2 ? ', ' + defaultAddress.address_line2 : ''}`,
          city: defaultAddress.city || "",
          state: defaultAddress.state || "",
          postalCode: defaultAddress.postal_code || "",
          country: defaultAddress.country || "Indonesia"
        });
      }
    } else if (user && !useExistingAddress) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.full_name || "",
        phone: user.phone || ""
      }));
    }
  }, [hasAddresses, useExistingAddress, addresses, user]);

  // Handle address change
  const handleAddressChange = (addressId: string) => {
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setSelectedAddressId(addressId);
      setShippingAddress({
        fullName: selectedAddress.recipient_name || "",
        phone: selectedAddress.phone || "",
        address: `${selectedAddress.address_line1}${selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''}`,
        city: selectedAddress.city || "",
        state: selectedAddress.state || "",
        postalCode: selectedAddress.postal_code || "",
        country: selectedAddress.country || "Indonesia"
      });
    }
  };

  // Handle shipping address field changes
  const handleShippingAddressChange = (field: keyof typeof shippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
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
        throw new Error(response.message || "Failed to create order");
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
        <CheckoutHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <ShippingAddressForm
              addresses={addresses}
              hasAddresses={hasAddresses}
              addressesLoading={addressesLoading}
              addressesError={addressesError}
              useExistingAddress={useExistingAddress}
              selectedAddressId={selectedAddressId}
              shippingAddress={shippingAddress}
              onUseExistingAddressChange={setUseExistingAddress}
              onAddressChange={handleAddressChange}
              onShippingAddressChange={handleShippingAddressChange}
            />

            <PaymentMethodForm
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />

            <OrderNotesForm
              notes={notes}
              onNotesChange={setNotes}
            />
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              loading={loading}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}