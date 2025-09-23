import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, Edit, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "bank_transfer";
  brand: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  cardholder_name: string;
}

export default function UserPaymentMethods() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit_card",
      brand: "Visa",
      last_four: "1234",
      expiry_month: 12,
      expiry_year: 2025,
      is_default: true,
      cardholder_name: "John Doe",
    },
    {
      id: "2",
      type: "credit_card",
      brand: "Mastercard",
      last_four: "5678",
      expiry_month: 6,
      expiry_year: 2026,
      is_default: false,
      cardholder_name: "John Doe",
    },
  ]);

  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      is_default: method.id === id,
    }));
    setPaymentMethods(updatedMethods);
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated.",
    });
  };

  const handleDelete = (id: string) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    toast({
      title: "Payment Method Deleted",
      description: "The payment method has been removed from your account.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Methods</h1>
        <p className="text-muted-foreground">
          Manage your payment methods
        </p>
      </div>
      
      <Separator />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
          <p className="text-sm text-muted-foreground">
            Add and manage your payment methods
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>
      
      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-medium">No payment methods yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first payment method to checkout faster.
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {method.brand}
                      {method.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      **** **** **** {method.last_four}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{method.cardholder_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}
                  </p>
                  {!method.is_default && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleSetDefault(method.id)}
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Payments
          </CardTitle>
          <CardDescription>
            Your payment information is encrypted and securely stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We use industry-standard encryption to protect your payment information. 
            Your card details are never stored directly on our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}