import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface KPIData {
  totalOrders: number;
  revenue: number;
  pending: number;
  delivered: number;
}

interface AdminKPICardsProps {
  kpis: KPIData | null;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = 'bg-coffee-medium' 
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  color?: string;
}) => (
  <Card className="card-shadow hover:warm-shadow smooth-transition">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-coffee-dark">
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function AdminKPICards({ kpis }: AdminKPICardsProps) {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Orders"
        value={kpis.totalOrders}
        icon={ShoppingCart}
        color="bg-coffee-medium"
      />
      
      <StatCard
        title="Revenue"
        value={`$${kpis.revenue.toLocaleString()}`}
        icon={DollarSign}
        color="bg-green-500"
      />
      
      <StatCard
        title="Pending Orders"
        value={kpis.pending}
        icon={Clock}
        color="bg-yellow-500"
      />
      
      <StatCard
        title="Delivered"
        value={kpis.delivered}
        icon={CheckCircle}
        color="bg-green-600"
      />
    </div>
  );
}
