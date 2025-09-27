import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee } from 'lucide-react';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md card-shadow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-coffee-medium/10 rounded-full">
              <Coffee className="h-8 w-8 text-coffee-medium" />
            </div>
          </div>
          <CardTitle className="font-display text-2xl text-coffee-dark">
            {title}
          </CardTitle>
          <p className="text-muted-foreground">
            {description}
          </p>
        </CardHeader>
        
        <CardContent>
          {children}
          {footer && (
            <div className="mt-6 text-center text-sm">
              {footer}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
