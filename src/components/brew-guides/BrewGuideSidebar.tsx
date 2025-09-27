import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Coffee, Play } from 'lucide-react';

interface BrewGuide {
  tips: string[];
  equipment: string[];
}

interface BrewGuideSidebarProps {
  guide: BrewGuide;
}

export function BrewGuideSidebar({ guide }: BrewGuideSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-caramel" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {guide.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-caramel rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-coffee-medium" />
            Equipment Needed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {guide.equipment.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-coffee-medium rounded-full" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="bg-gradient-to-br from-coffee-medium to-coffee-dark text-cream">
        <CardContent className="p-6">
          <h4 className="font-display text-lg font-bold mb-3">
            Ready to Start?
          </h4>
          <p className="text-cream/90 text-sm mb-4">
            Get the perfect coffee beans for this brewing method.
          </p>
          <Button variant="caramel" className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Shop Coffee Beans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
