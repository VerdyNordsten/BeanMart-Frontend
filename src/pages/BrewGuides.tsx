import { useState } from "react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { 
  Coffee, 
  Thermometer, 
  Droplets, 
  Scale, 
  Timer,
  Star,
  BookOpen
} from "lucide-react";
import { BrewGuidesHero } from "@/features/brew-guides/BrewGuidesHero";
import { BrewMethodSelector } from "@/features/brew-guides/BrewMethodSelector";
import { BrewGuideSidebar } from "@/features/brew-guides/BrewGuideSidebar";
import { BrewStepCard } from "@/features/brew-guides/BrewStepCard";

export default function BrewGuides() {
  const [selectedMethod, setSelectedMethod] = useState('pour-over');

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
      <BrewGuidesHero />

      {/* Brew Methods Selection */}
      <BrewMethodSelector 
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
      />

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
                  {currentGuide.steps.map((step) => (
                    <BrewStepCard key={step.step} step={step} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <BrewGuideSidebar guide={currentGuide} />
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
