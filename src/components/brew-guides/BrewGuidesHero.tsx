import { BookOpen, Users, Star } from 'lucide-react';

export function BrewGuidesHero() {
  return (
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
  );
}
