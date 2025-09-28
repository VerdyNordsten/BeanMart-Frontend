import { BrewMethodCard } from "./BrewMethodCard";
import { Coffee, Droplets } from "lucide-react";

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

interface BrewMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export function BrewMethodSelector({ selectedMethod, onMethodChange }: BrewMethodSelectorProps) {
  return (
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
          {brewMethods.map((method) => (
            <BrewMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethod === method.id}
              onSelect={onMethodChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
