import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import lightRoastImage from '@/assets/light-roast-coffee.png';
import mediumRoastImage from '@/assets/medium-roast-coffee.png';
import darkRoastImage from '@/assets/dark-roast-coffee.png';

const roastFeatures = [
  {
    title: 'Light Roast',
    description: 'Bright, floral, and citrusy notes that highlight the origin characteristics',
    color: 'bg-caramel/10 border-caramel/30',
    textColor: 'text-caramel',
    image: lightRoastImage,
    features: ['Bright acidity', 'Floral notes', 'Citrusy finish'],
    temperature: '356-401°F',
  },
  {
    title: 'Medium Roast',
    description: 'Perfect balance of origin flavors and roasted sweetness',
    color: 'bg-coffee-medium/10 border-coffee-medium/30',
    textColor: 'text-coffee-medium',
    image: mediumRoastImage,
    features: ['Balanced body', 'Sweet caramel', 'Nutty undertones'],
    temperature: '410-428°F',
  },
  {
    title: 'Dark Roast',
    description: 'Rich, bold, and full-bodied with deep chocolate undertones',
    color: 'bg-coffee-dark/10 border-coffee-dark/30',
    textColor: 'text-coffee-dark',
    image: darkRoastImage,
    features: ['Full body', 'Bold flavor', 'Chocolate notes'],
    temperature: '437-446°F',
  },
];

export function RoastFeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
      <div className="container max-w-screen-2xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl font-bold text-coffee-dark mb-6">
            Roast to Your Taste
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            Every roast level offers a unique flavor profile. Discover which roast 
            matches your perfect cup of coffee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {roastFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className={`group border-2 ${feature.color} hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden`}
            >
              <div className="relative">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={feature.image}
                    alt={`${feature.title} coffee beans`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="absolute top-4 right-4">
                  <Badge className={`${feature.textColor} bg-white/90 backdrop-blur-sm`}>
                    {feature.temperature}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-8">
                <h3 className={`font-display text-3xl font-bold mb-4 ${feature.textColor} group-hover:scale-105 transition-transform duration-300`}>
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-coffee-dark text-lg">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((feat, featIndex) => (
                      <Badge 
                        key={featIndex} 
                        variant="secondary" 
                        className="bg-white/80 text-coffee-dark hover:bg-coffee-medium/20 transition-colors duration-200"
                      >
                        {feat}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="coffee-outline" 
                  className="w-full group-hover:bg-coffee-medium group-hover:text-white transition-all duration-300"
                  asChild
                >
                  <Link to="/products">
                    Explore {feature.title}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Roast Comparison */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h3 className="font-display text-3xl font-bold text-coffee-dark text-center mb-8">
            Roast Level Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roastFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-lg"
                     style={{ 
                       backgroundColor: feature.title === 'Light Roast' ? '#D4A574' : 
                                      feature.title === 'Medium Roast' ? '#8B4513' : '#2F1B14' 
                     }}>
                  {index + 1}
                </div>
                <h4 className={`font-semibold text-lg mb-2 ${feature.textColor}`}>
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature.temperature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
