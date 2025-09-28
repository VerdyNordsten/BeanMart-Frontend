import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/shared/SEO";
import { NotFoundContent } from "@/shared/NotFoundContent";

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
      <NotFoundContent pathname={location.pathname} />
    </div>
  );
};

export default NotFound;
