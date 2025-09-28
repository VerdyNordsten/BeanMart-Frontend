import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";

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

export function TimelineSection() {
  return (
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
  );
}
