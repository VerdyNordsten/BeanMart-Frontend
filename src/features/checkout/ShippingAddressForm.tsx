import { Link } from "react-router-dom";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { MapPin } from "lucide-react";

interface Address {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingAddressFormProps {
  addresses: Address[];
  hasAddresses: boolean;
  addressesLoading: boolean;
  addressesError: string | Error | null;
  useExistingAddress: boolean;
  selectedAddressId: string;
  shippingAddress: ShippingAddress;
  onUseExistingAddressChange: (use: boolean) => void;
  onAddressChange: (addressId: string) => void;
  onShippingAddressChange: (field: keyof ShippingAddress, value: string) => void;
}

export function ShippingAddressForm({
  addresses,
  hasAddresses,
  addressesLoading: _addressesLoading,
  addressesError,
  useExistingAddress,
  selectedAddressId,
  shippingAddress,
  onUseExistingAddressChange,
  onAddressChange,
  onShippingAddressChange,
}: ShippingAddressFormProps) {
  return (
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
                onChange={() => onUseExistingAddressChange(true)}
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
                  onChange={(e) => onAddressChange(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label || "Address"} - {address.recipient_name} - {address.city}
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
                onChange={() => onUseExistingAddressChange(false)}
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
                  onChange={(e) => onShippingAddressChange('fullName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={shippingAddress.phone}
                  onChange={(e) => onShippingAddressChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={shippingAddress.address}
                onChange={(e) => onShippingAddressChange('address', e.target.value)}
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
                  onChange={(e) => onShippingAddressChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => onShippingAddressChange('state', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={(e) => onShippingAddressChange('postalCode', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
