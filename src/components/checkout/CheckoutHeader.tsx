import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function CheckoutHeader() {
  return (
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
  );
}
