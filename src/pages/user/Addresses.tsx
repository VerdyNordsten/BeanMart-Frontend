import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { userAddressesApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Address {
  id: string;
  user_id: string;
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
  created_at: string;
}

export default function UserAddresses() {
  const { user, token } = useAuthStore();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    recipient_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  useEffect(() => {
    if (user && token) {
      fetchAddresses();
    }
  }, [user, token]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAddressesApi.getUserAddresses(user!.id);
      
      if (response.success) {
        setAddresses(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch addresses");
      }
    } catch (err: any) {
      console.error("Failed to fetch addresses:", err);
      setError(err.message || "Failed to load addresses. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load addresses. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      if (!user || !token) {
        throw new Error("User not authenticated");
      }
      
      const response = await userAddressesApi.setUserAddressAsDefault(id, user.id);
      
      if (response.success) {
        // Update the addresses state to reflect the change
        const updatedAddresses = addresses.map(address => ({
          ...address,
          is_default: address.id === id,
        }));
        setAddresses(updatedAddresses);
        
        toast({
          title: "Default Address Updated",
          description: "Your default shipping address has been updated.",
        });
      } else {
        throw new Error(response.message || "Failed to set default address");
      }
    } catch (err: any) {
      console.error("Failed to set default address:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update default address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!token) {
        throw new Error("User not authenticated");
      }
      
      const response = await userAddressesApi.deleteUserAddress(id);
      
      if (response.success) {
        const updatedAddresses = addresses.filter(address => address.id !== id);
        setAddresses(updatedAddresses);
        
        toast({
          title: "Address Deleted",
          description: "The address has been removed from your account.",
        });
      } else {
        throw new Error(response.message || "Failed to delete address");
      }
    } catch (err: any) {
      console.error("Failed to delete address:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddAddress = async () => {
    try {
      if (!user || !token) {
        throw new Error("User not authenticated");
      }

      // Validate required fields
      if (!newAddress.label.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a label for this address.",
          variant: "destructive",
        });
        return;
      }

      if (!newAddress.recipient_name.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter the recipient name.",
          variant: "destructive",
        });
        return;
      }

      if (!newAddress.phone.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a phone number.",
          variant: "destructive",
        });
        return;
      }

      // Validate phone number format (should be international format with +)
      // Allow formats like +6281234567890 or +1234567890
      const phoneRegex = /^\+[1-9]\d{7,14}$/;
      if (!phoneRegex.test(newAddress.phone.trim())) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid phone number in international format (e.g., +6281234567890).",
          variant: "destructive",
        });
        return;
      }

      if (!newAddress.address_line1.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter the street address.",
          variant: "destructive",
        });
        return;
      }

      if (!newAddress.city.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter the city.",
          variant: "destructive",
        });
        return;
      }

      if (!newAddress.state.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter the state/province.",
          variant: "destructive",
        });
        return;
      }

      if (!newAddress.postal_code.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter the postal code.",
          variant: "destructive",
        });
        return;
      }

      if (!newAddress.country.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter the country.",
          variant: "destructive",
        });
        return;
      }

      // Prepare address data according to API documentation - ONLY send required fields
      const addressData: Record<string, string | boolean> = {
        label: newAddress.label.trim(),
        recipient_name: newAddress.recipient_name.trim(),
        phone: newAddress.phone.trim(),
        address_line1: newAddress.address_line1.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        postal_code: newAddress.postal_code.trim(),
        country: newAddress.country.trim(),
        is_default: Boolean(newAddress.is_default),
      };

      // Only add address_line2 if it has a value
      if (newAddress.address_line2 && newAddress.address_line2.trim()) {
        addressData.address_line2 = newAddress.address_line2.trim();
      }

      const response = await userAddressesApi.createUserAddress(user.id, addressData);
      
      if (response.success && response.data) {
        // Add the new address to the list
        setAddresses([...addresses, response.data]);
        
        // Reset the form and close the dialog
        setNewAddress({
          label: "",
          recipient_name: "",
          phone: "",
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
          is_default: false,
        });
        setIsAddDialogOpen(false);
        
        toast({
          title: "Address Added",
          description: "Your new address has been added successfully.",
        });
      } else {
        throw new Error(response.message || "Failed to add address");
      }
    } catch (err: any) {
      console.error("Failed to add address:", err);
      
      // Try to get more detailed error information
      let errorMessage = "Failed to add address. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid data provided. Please check all fields and try again.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Addresses</h1>
          <p className="text-muted-foreground">
            Manage your shipping addresses
          </p>
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Shipping Addresses</h2>
            <p className="text-sm text-muted-foreground">
              Add and manage your shipping addresses
            </p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-6 w-24 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-muted rounded"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                  <div className="h-4 w-1/3 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Addresses</h1>
          <p className="text-muted-foreground">
            Manage your shipping addresses
          </p>
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Shipping Addresses</h2>
            <p className="text-sm text-muted-foreground">
              Add and manage your shipping addresses
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
        
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-red-500 font-medium">Error: {error}</div>
            <Button className="mt-4" onClick={fetchAddresses}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Addresses</h1>
        <p className="text-muted-foreground">
          Manage your shipping addresses
        </p>
      </div>
      
      <Separator />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Shipping Addresses</h2>
          <p className="text-sm text-muted-foreground">
            Add and manage your shipping addresses
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                Enter your shipping address details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Input
                  id="label"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                  className="col-span-3"
                  placeholder="e.g., Home, Office"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recipient_name" className="text-right">
                  Recipient
                </Label>
                <Input
                  id="recipient_name"
                  value={newAddress.recipient_name}
                  onChange={(e) => setNewAddress({...newAddress, recipient_name: e.target.value})}
                  className="col-span-3"
                  placeholder="Full name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  className="col-span-3"
                  placeholder="e.g., +6281234567890"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address_line1" className="text-right">
                  Address 1
                </Label>
                <Input
                  id="address_line1"
                  value={newAddress.address_line1}
                  onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                  className="col-span-3"
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address_line2" className="text-right">
                  Address 2
                </Label>
                <Input
                  id="address_line2"
                  value={newAddress.address_line2}
                  onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
                  className="col-span-3"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  className="col-span-3"
                  placeholder="City"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">
                  State
                </Label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  className="col-span-3"
                  placeholder="State/Province"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="postal_code" className="text-right">
                  Postal Code
                </Label>
                <Input
                  id="postal_code"
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                  className="col-span-3"
                  placeholder="Postal code"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Country
                </Label>
                <Input
                  id="country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                  className="col-span-3"
                  placeholder="Country"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAddress}>
                Add Address
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-medium">No addresses yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first shipping address to get started.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {address.label}
                      {address.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {address.recipient_name}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>{address.city}, {address.state} {address.postal_code}</p>
                  <p>{address.country}</p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  {!address.is_default && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}