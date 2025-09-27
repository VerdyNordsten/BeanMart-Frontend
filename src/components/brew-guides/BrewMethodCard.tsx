import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star } from 'lucide-react';

interface BrewMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  difficulty: string;
  time: string;
  description: string;
  color: string;
  popularity: number;
}

interface BrewMethodCardProps {
  method: BrewMethod;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function BrewMethodCard({ method, isSelected, onSelect }: BrewMethodCardProps) {
  const IconComponent = method.icon;
  
  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        isSelected ? 'ring-2 ring-coffee-medium' : ''
      }`}
      onClick={() => onSelect(method.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <IconComponent className="h-8 w-8 text-coffee-medium" />
          <Badge className={method.color}>
            {method.difficulty}
          </Badge>
        </div>
        
        <h3 className="font-display text-xl font-bold text-coffee-dark mb-2">
          {method.name}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          {method.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{method.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{method.popularity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
