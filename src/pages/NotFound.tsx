import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Coffee, Home } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SEO
        title="404 - Page Not Found | Beanmart"
        description="The page you're looking for doesn't exist. Browse our premium coffee collection or return to the homepage."
        url={location.pathname}
        type="website"
      />
      <div className="text-center max-w-md mx-auto px-4">
        <Coffee className="h-16 w-16 text-coffee-medium mx-auto mb-6" />
        <h1 className="font-display text-6xl font-bold text-coffee-dark mb-4">404</h1>
        <h2 className="font-display text-2xl font-semibold text-coffee-dark mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          Looks like this page got lost in the coffee grounds. 
          Let's get you back to something brewing!
        </p>
        <Button variant="coffee" size="lg" asChild>
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
