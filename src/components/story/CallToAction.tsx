import { Coffee } from 'lucide-react';

export function CallToAction() {
  return (
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
  );
}
