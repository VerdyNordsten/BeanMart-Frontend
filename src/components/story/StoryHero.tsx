import farmImage from '@/assets/coffee-farm.jpg';

export function StoryHero() {
  return (
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
  );
}
