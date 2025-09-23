import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Award, Heart, Globe, Users, Coffee } from 'lucide-react';
import farmImage from '@/assets/coffee-farm.jpg';

const milestones = [
  {
    year: '2018',
    title: 'The Beginning',
    description: 'Founded with a mission to connect coffee lovers directly with exceptional farmers around the world.',
  },
  {
    year: '2019',
    title: 'First Partnerships',
    description: 'Established direct trade relationships with farmers in Ethiopia and Colombia.',
  },
  {
    year: '2020',
    title: 'Roastery Opens',  
    description: 'Opened our first roastery, focusing on small-batch, artisanal roasting techniques.',
  },
  {
    year: '2021',
    title: 'Sustainability Focus',
    description: 'Launched our carbon-neutral shipping and sustainable packaging initiative.',
  },
  {
    year: '2022',
    title: 'Global Expansion',
    description: 'Expanded partnerships to include farms in Guatemala, Kenya, and Brazil.',
  },
  {
    year: '2024',
    title: 'Community Impact',
    description: 'Reached over 1000 farming families supported through our direct trade program.',
  },
];

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

export default function Story() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-coffee-dark/90 to-coffee-medium/70" />
        <div className="absolute inset-0">
          <img
            src={farmImage}
            alt="Coffee farm landscape"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 container max-w-screen-2xl text-center text-cream">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-cream/90 max-w-3xl mx-auto">
            A journey of passion, sustainability, and exceptional coffee that connects 
            farmers and coffee lovers around the world.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-background">
        <div className="container max-w-screen-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-coffee-dark mb-6">
              More Than Just Coffee
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Beanmart, we believe coffee is more than a beverage – it's a connection between cultures, 
              a bridge between communities, and a catalyst for positive change. Our mission is to source 
              the world's finest coffee beans while supporting the farmers who grow them and the 
              communities they call home.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
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

      {/* Timeline */}
      <section className="py-16 bg-background">
        <div className="container max-w-screen-2xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-coffee-dark mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground text-lg">
              From humble beginnings to global impact
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-coffee-light/30" />
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <Card className="card-shadow">
                      <CardContent className="p-6">
                        <Badge variant="outline" className="mb-3 text-coffee-medium border-coffee-medium">
                          {milestone.year}
                        </Badge>
                        <h3 className="font-display text-xl font-semibold text-coffee-dark mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-coffee-medium rounded-full border-4 border-background" />
                  
                  {/* Spacer */}
                  <div className="w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-coffee-dark text-cream">
        <div className="container max-w-screen-2xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-cream/80 text-lg">
              Together, we're making a difference in coffee communities worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-caramel mb-2">1000+</div>
              <div className="text-cream/80">Farming Families Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-caramel mb-2">15</div>
              <div className="text-cream/80">Countries Sourced From</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-caramel mb-2">50,000+</div>
              <div className="text-cream/80">Pounds Roasted Annually</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-caramel mb-2">Carbon</div>
              <div className="text-cream/80">Neutral Shipping</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-screen-2xl text-center">
          <Coffee className="h-12 w-12 text-coffee-medium mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-coffee-dark mb-4">
            Join Our Journey
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Every cup you enjoy supports sustainable farming practices and helps build 
            stronger coffee communities around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-3 bg-coffee-medium text-cream rounded-lg hover:bg-coffee-dark smooth-transition font-semibold"
            >
              Shop Our Coffee
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-coffee-medium text-coffee-medium rounded-lg hover:bg-coffee-medium hover:text-cream smooth-transition font-semibold"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}