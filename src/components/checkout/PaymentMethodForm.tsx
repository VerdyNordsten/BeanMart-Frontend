import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface PaymentMethodFormProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export function PaymentMethodForm({ paymentMethod, onPaymentMethodChange }: PaymentMethodFormProps) {
  return (
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
              onChange={(e) => onPaymentMethodChange(e.target.value)}
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
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="h-4 w-4"
            />
            <Label htmlFor="cod" className="flex-1 cursor-pointer">
              Cash on Delivery (COD)
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
