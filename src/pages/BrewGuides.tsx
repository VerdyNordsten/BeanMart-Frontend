import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coffee, 
  Clock, 
  Thermometer, 
  Droplets, 
  Scale, 
  Timer,
  Play,
  BookOpen,
  Star,
  Users
} from 'lucide-react';

export default function BrewGuides() {
  const [selectedMethod, setSelectedMethod] = useState('pour-over');

  const brewMethods = [
    {
      id: 'pour-over',
      name: 'Pour Over',
      icon: Droplets,
      difficulty: 'Intermediate',
      time: '4-5 min',
      description: 'The classic method for clean, bright coffee with full control over extraction',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      popularity: 95,
    },
    {
      id: 'french-press',
      name: 'French Press',
      icon: Coffee,
      difficulty: 'Beginner',
      time: '4-6 min',
      description: 'Simple immersion brewing that produces rich, full-bodied coffee',
      color: 'bg-green-50 border-green-200 text-green-800',
      popularity: 88,
    },
    {
      id: 'espresso',
      name: 'Espresso',
      icon: Coffee,
      difficulty: 'Advanced',
      time: '2-3 min',
      description: 'Intense, concentrated coffee with a rich crema layer',
      color: 'bg-red-50 border-red-200 text-red-800',
      popularity: 92,
    },
    {
      id: 'aeropress',
      name: 'AeroPress',
      icon: Coffee,
      difficulty: 'Beginner',
      time: '2-3 min',
      description: 'Versatile brewing method that can produce both espresso-like and filter coffee',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      popularity: 85,
    },
    {
      id: 'cold-brew',
      name: 'Cold Brew',
      icon: Coffee,
      difficulty: 'Beginner',
      time: '12-24 hours',
      description: 'Smooth, low-acid coffee perfect for hot summer days',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-800',
      popularity: 78,
    },
    {
      id: 'moka-pot',
      name: 'Moka Pot',
      icon: Coffee,
      difficulty: 'Intermediate',
      time: '5-7 min',
      description: 'Stovetop brewing that produces strong, espresso-like coffee',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      popularity: 72,
    },
  ];

  const brewGuides = {
    'pour-over': {
      steps: [
        {
          step: 1,
          title: 'Heat Water',
          description: 'Heat water to 200-205°F (93-96°C)',
          details: 'Use a gooseneck kettle for better control. The water should be just off the boil.',
          icon: Thermometer,
          time: '2-3 min',
        },
        {
          step: 2,
          title: 'Grind Coffee',
          description: 'Grind 20-25g of coffee to medium-fine consistency',
          details: 'The grind should be similar to table salt. Too fine will over-extract, too coarse will under-extract.',
          icon: Scale,
          time: '30 sec',
        },
        {
          step: 3,
          title: 'Pre-wet Filter',
          description: 'Place filter in dripper and rinse with hot water',
          details: 'This removes paper taste and preheats the dripper. Discard the rinse water.',
          icon: Droplets,
          time: '30 sec',
        },
        {
          step: 4,
          title: 'Add Coffee',
          description: 'Add ground coffee to the filter and level the bed',
          details: 'Make sure the coffee bed is level for even extraction.',
          icon: Coffee,
          time: '15 sec',
        },
        {
          step: 5,
          title: 'Bloom',
          description: 'Pour 50-60ml of water in a circular motion',
          details: 'Start from the center and spiral outward. Let it bloom for 30-45 seconds.',
          icon: Timer,
          time: '45 sec',
        },
        {
          step: 6,
          title: 'Main Pour',
          description: 'Continue pouring in stages until you reach 300-400ml',
          details: 'Pour in 50-100ml increments, waiting 10-15 seconds between pours. Total time should be 3-4 minutes.',
          icon: Droplets,
          time: '3-4 min',
        },
      ],
      tips: [
        'Use freshly roasted coffee beans for best flavor',
        'Keep your pouring technique consistent',
        'Adjust grind size if extraction is too fast or slow',
        'Preheat your mug to maintain temperature',
      ],
      equipment: [
        'Gooseneck kettle',
        'Pour-over dripper (V60, Chemex, etc.)',
        'Paper filters',
        'Coffee grinder',
        'Scale',
        'Timer',
      ],
    },
    'french-press': {
      steps: [
        {
          step: 1,
          title: 'Heat Water',
          description: 'Heat water to 200°F (93°C)',
          details: 'Water should be just off the boil to avoid over-extraction.',
          icon: Thermometer,
          time: '2-3 min',
        },
        {
          step: 2,
          title: 'Grind Coffee',
          description: 'Grind 30-35g of coffee to coarse consistency',
          details: 'The grind should be similar to breadcrumbs. Too fine will make the coffee muddy.',
          icon: Scale,
          time: '30 sec',
        },
        {
          step: 3,
          title: 'Add Coffee',
          description: 'Add ground coffee to the French press',
          details: 'Make sure the coffee is evenly distributed in the bottom.',
          icon: Coffee,
          time: '15 sec',
        },
        {
          step: 4,
          title: 'Pour Water',
          description: 'Pour 500ml of hot water over the coffee',
          details: 'Pour slowly and evenly to ensure all grounds are saturated.',
          icon: Droplets,
          time: '30 sec',
        },
        {
          step: 5,
          title: 'Stir & Steep',
          description: 'Stir gently and let steep for 4 minutes',
          details: 'Place the lid on but don\'t press yet. Let it steep for the full 4 minutes.',
          icon: Timer,
          time: '4 min',
        },
        {
          step: 6,
          title: 'Press & Serve',
          description: 'Press down slowly and pour immediately',
          details: 'Press down slowly and steadily. Pour immediately to avoid over-extraction.',
          icon: Coffee,
          time: '30 sec',
        },
      ],
      tips: [
        'Use coarse grind to avoid sediment in your cup',
        'Don\'t let the coffee sit in the press after pressing',
        'Clean the French press thoroughly after each use',
        'Experiment with steeping time for different strengths',
      ],
      equipment: [
        'French press (8-12 cup capacity)',
        'Coffee grinder',
        'Kettle',
        'Scale',
        'Timer',
      ],
    },
    'espresso': {
      steps: [
        {
          step: 1,
          title: 'Preheat Machine',
          description: 'Turn on espresso machine and let it heat up',
          details: 'Most machines need 15-20 minutes to reach optimal temperature.',
          icon: Thermometer,
          time: '15-20 min',
        },
        {
          step: 2,
          title: 'Grind Coffee',
          description: 'Grind 18-20g of coffee to fine consistency',
          details: 'The grind should be very fine, similar to powdered sugar.',
          icon: Scale,
          time: '30 sec',
        },
        {
          step: 3,
          title: 'Dose & Tamp',
          description: 'Dose coffee into portafilter and tamp evenly',
          details: 'Apply 30 pounds of pressure with a level tamp. The puck should be smooth and level.',
          icon: Coffee,
          time: '30 sec',
        },
        {
          step: 4,
          title: 'Extract',
          description: 'Extract 30-36ml of espresso in 25-30 seconds',
          details: 'Start the extraction and stop when you reach the target volume.',
          icon: Timer,
          time: '25-30 sec',
        },
        {
          step: 5,
          title: 'Check Quality',
          description: 'Observe the crema and extraction time',
          details: 'Good espresso should have a golden crema and extract in the target time.',
          icon: Star,
          time: '5 sec',
        },
      ],
      tips: [
        'Use freshly roasted coffee beans',
        'Keep your portafilter clean and dry',
        'Practice your tamping technique for consistency',
        'Adjust grind size based on extraction time',
      ],
      equipment: [
        'Espresso machine',
        'Coffee grinder (burr grinder recommended)',
        'Portafilter and basket',
        'Tamper',
        'Scale',
        'Timer',
      ],
    },
  };

  const currentGuide = brewGuides[selectedMethod as keyof typeof brewGuides];

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/20 to-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-coffee-dark to-coffee-medium text-cream">
        <div className="container max-w-screen-2xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Brew Guides
            </h1>
            <p className="text-xl md:text-2xl text-cream/90 mb-8">
              Master the art of coffee brewing with our comprehensive guides. 
              From beginner-friendly methods to advanced techniques.
            </p>
            <div className="flex items-center justify-center gap-8 text-cream/80">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>6 Methods</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Expert Tips</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span>Proven Techniques</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brew Methods Selection */}
      <section className="py-16">
        <div className="container max-w-screen-2xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-coffee-dark mb-4">
              Choose Your Brew Method
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each method offers a unique flavor profile and brewing experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {brewMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card
                  key={method.id}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    selectedMethod === method.id ? 'ring-2 ring-coffee-medium' : ''
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
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
            })}
          </div>
        </div>
      </section>

      {/* Brew Guide Details */}
      {currentGuide && (
        <section className="py-16 bg-muted/30">
          <div className="container max-w-screen-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Steps */}
              <div className="lg:col-span-2">
                <h3 className="font-display text-3xl font-bold text-coffee-dark mb-8">
                  Step-by-Step Guide
                </h3>
                
                <div className="space-y-6">
                  {currentGuide.steps.map((step) => {
                    const IconComponent = step.icon;
                    return (
                      <Card key={step.step} className="group hover:shadow-lg transition-all duration-300">
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
                  })}
                </div>
              </div>

              {/* Sidebar */}
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
                      {currentGuide.tips.map((tip, index) => (
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
                      {currentGuide.equipment.map((item, index) => (
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
            </div>
          </div>
        </section>
      )}

      {/* Additional Resources */}
      <section className="py-16 bg-background">
        <div className="container max-w-screen-2xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-coffee-dark mb-4">
              Master Your Craft
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Take your coffee brewing to the next level with our expert resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-caramel/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-caramel" />
                </div>
                <h3 className="font-display text-xl font-bold text-coffee-dark mb-3">
                  Coffee Science
                </h3>
                <p className="text-muted-foreground mb-4">
                  Understand the chemistry behind great coffee and how different variables affect taste.
                </p>
                <Button variant="coffee-outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-coffee-medium/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Scale className="h-8 w-8 text-coffee-medium" />
                </div>
                <h3 className="font-display text-xl font-bold text-coffee-dark mb-3">
                  Precision Tools
                </h3>
                <p className="text-muted-foreground mb-4">
                  Discover the essential tools and equipment that will elevate your brewing game.
                </p>
                <Button variant="coffee-outline" className="w-full">
                  View Tools
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-coffee-dark/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-coffee-dark" />
                </div>
                <h3 className="font-display text-xl font-bold text-coffee-dark mb-3">
                  Community
                </h3>
                <p className="text-muted-foreground mb-4">
                  Join our community of coffee enthusiasts and share your brewing experiences.
                </p>
                <Button variant="coffee-outline" className="w-full">
                  Join Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
