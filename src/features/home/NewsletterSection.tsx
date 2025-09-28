import { useState } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <section className="py-16 bg-coffee-dark text-cream">
      <div className="container max-w-screen-2xl text-center">
        <Mail className="h-12 w-12 text-caramel mx-auto mb-6" />
        <h2 className="font-display text-3xl font-bold mb-4">
          Stay Connected
        </h2>
        <p className="text-cream/80 text-lg mb-8 max-w-2xl mx-auto">
          Get the latest updates on new arrivals, brewing tips, and exclusive offers 
          delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-cream text-coffee-dark border-0"
          />
          <Button type="submit" variant="caramel">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
