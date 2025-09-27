import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface BrewStep {
  step: number;
  title: string;
  description: string;
  details: string;
  icon: React.ElementType;
  time: string;
}

interface BrewStepCardProps {
  step: BrewStep;
}

export function BrewStepCard({ step }: BrewStepCardProps) {
  const IconComponent = step.icon;
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-coffee-medium text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-300">
              {step.step}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <IconComponent className="h-5 w-5 text-coffee-medium" />
              <h4 className="font-display text-xl font-semibold text-coffee-dark">
                {step.title}
              </h4>
              <Badge variant="outline" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                {step.time}
              </Badge>
            </div>
            
            <p className="text-coffee-dark font-medium mb-2">
              {step.description}
            </p>
            
            <p className="text-muted-foreground">
              {step.details}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
