import { Link } from "react-router-dom";
import { Button } from "@/ui/button";
import { Leaf, Coffee, Award } from "lucide-react";
import farmImage from "@/assets/coffee-farm.jpg";

export function FarmToCupSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container max-w-screen-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-4xl font-bold text-coffee-dark mb-6">
              From Farm to Cup
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We work directly with coffee farmers around the world, ensuring fair trade practices 
              and sustainable farming methods. Every bean is carefully selected, roasted in small 
              batches, and shipped fresh to preserve the unique flavors of each origin.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Leaf className="h-6 w-6 text-coffee-medium mt-1" />
                <div>
                  <h3 className="font-semibold text-coffee-dark mb-1">Sustainable Sourcing</h3>
                  <p className="text-muted-foreground">Direct partnerships with farmers committed to environmental stewardship</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Coffee className="h-6 w-6 text-coffee-medium mt-1" />
                <div>
                  <h3 className="font-semibold text-coffee-dark mb-1">Expert Roasting</h3>
                  <p className="text-muted-foreground">Small-batch roasting to bring out the unique characteristics of each bean</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Award className="h-6 w-6 text-coffee-medium mt-1" />
                <div>
                  <h3 className="font-semibold text-coffee-dark mb-1">Quality Guaranteed</h3>
                  <p className="text-muted-foreground">Every batch is cupped and approved by our quality control team</p>
                </div>
              </div>
            </div>

            <Button variant="coffee" size="lg" className="mt-8" asChild>
              <Link to="/story">Learn Our Story</Link>
            </Button>
          </div>
          
          <div className="lg:order-first">
            <img
              src={farmImage}
              alt="Coffee farm in the mountains"
              className="w-full rounded-lg card-shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
