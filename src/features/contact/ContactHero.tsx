import { Coffee } from "lucide-react";

export function ContactHero() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-screen-2xl text-center">
        <Coffee className="h-16 w-16 text-coffee-medium mx-auto mb-6" />
        <h1 className="font-display text-5xl font-bold text-coffee-dark mb-4">
          Get in Touch
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have a question about our coffee, need help with an order, or just want to chat about beans? 
          We'd love to hear from you.
        </p>
      </div>
    </section>
  );
}
