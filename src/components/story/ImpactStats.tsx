export function ImpactStats() {
  return (
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
  );
}
