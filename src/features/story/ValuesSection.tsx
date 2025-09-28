import { Card, CardContent } from "@/ui/card";
import { Heart, Leaf, Award, Globe } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: 'Direct Trade',
    description: 'We build long-term relationships with farmers, ensuring they receive fair compensation for their exceptional coffee.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Environmental responsibility guides every decision, from farming practices to packaging materials.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'Every batch is meticulously cupped and approved before reaching our customers.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Connecting coffee lovers worldwide with the farmers who grow their favorite beans.',
  },
];

export function ValuesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-screen-2xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-coffee-dark mb-4">
            Our Values
          </h2>
          <p className="text-muted-foreground text-lg">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="card-shadow hover:warm-shadow smooth-transition">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-coffee-medium/10 rounded-lg">
                      <Icon className="h-6 w-6 text-coffee-medium" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-coffee-dark mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
