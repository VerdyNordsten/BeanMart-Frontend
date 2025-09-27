import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
  loading?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'positive',
  color = 'bg-blue-500',
  loading = false
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-16 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const changeColor = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  }[changeType];

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-4 w-4 ${changeColor} mr-1`} />
                <span className={`text-sm ${changeColor}`}>{change}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <div className="h-6 w-6 text-white flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
