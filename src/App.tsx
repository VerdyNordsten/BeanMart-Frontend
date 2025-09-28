import { Toaster } from "@/ui/toaster";
import { Toaster as Sonner } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SEODebug } from "@/shared/SEODebug";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { Cart } from "@/features/cart/Cart";
import Home from "./pages/Home";
import ProductPage from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Story from "./pages/Story";
import Contact from "./pages/Contact";
import BrewGuides from "./pages/BrewGuides";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import UserLogin from "./pages/user/Login";
import UserRegister from "./pages/user/Register";
import { AdminLayout } from "@/features/admin/AdminLayout";
import { UserLayout } from "@/features/user/UserLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminRoastLevels from "./pages/admin/RoastLevels";
import AdminOrders from "./pages/admin/Orders";
import UserDashboard from "./pages/user/Dashboard";
import UserOrders from "./pages/user/Orders";
import UserProfile from "./pages/user/Profile";
import UserAddresses from "./pages/user/Addresses";
import UserPaymentMethods from "./pages/user/PaymentMethods";
import { ErrorBoundary } from "@/shared/ErrorBoundary";
import { globalErrorHandler } from "@/utils/globalErrorHandler";
import "@/lib/sentry"; // Initialize Sentry

// Initialize global error handling
globalErrorHandler.initialize();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 minutes - data stays fresh longer
      gcTime: 60 * 60 * 1000, // 60 minutes - keep in cache for 1 hour (renamed from cacheTime)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: false, // Don't refetch when component mounts if data is fresh
      refetchOnReconnect: false, // Don't refetch when reconnecting
      retry: 1, // Only retry once on failure
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/story" element={<Story />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/brew-guides" element={<BrewGuides />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/user" element={<UserLayout />}>
                  <Route index element={<UserDashboard />} />
                  <Route path="orders" element={<UserOrders />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="addresses" element={<UserAddresses />} />
                  <Route path="payment-methods" element={<UserPaymentMethods />} />
                </Route>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="roast-levels" element={<AdminRoastLevels />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Cart />
            <SEODebug />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
