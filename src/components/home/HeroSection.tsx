import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-coffee.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium coffee beans"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>
      
      <div className="relative z-10 text-center text-cream px-4 max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
          From Bean to
          <span className="block text-caramel">Perfect Cup</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-cream/90 max-w-2xl mx-auto">
          Discover exceptional coffee sourced directly from farmers, 
          roasted to perfection, and delivered fresh to your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="xl" asChild>
            <Link to="/products">
              Shop Beans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="coffee-outline" size="xl" asChild>
            <Link to="/story">Our Story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
