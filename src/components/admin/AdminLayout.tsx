import { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { Button } from '@/components/atoms/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/molecules/sheet';
import { Badge } from '@/components/atoms/badge';
import { 
  Menu, 
  LayoutDashboard, 
  Package, 
  Tags, 
  Settings, 
  ShoppingCart, 
  Users, 
  FileImage,
  LogOut,
  Coffee,
  Flame
} from 'lucide-react';
import { useAuthStore, isAdmin } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Roast Levels', href: '/admin/roast-levels', icon: Flame },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Files', href: '/admin/files', icon: FileImage },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { toast } = useToast();

  // Redirect if not admin
  if (!user || !isAdmin(user)) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-card border-r overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Coffee className="h-8 w-8 text-coffee-medium" />
            <span className="ml-2 text-xl font-display font-bold text-coffee-dark">
              Beanmart Admin
            </span>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md smooth-transition ${
                      isActive
                        ? 'bg-coffee-medium text-cream'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-cream' : 'text-muted-foreground'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User info */}
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.full_name}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {user.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-5 border-b">
              <Coffee className="h-8 w-8 text-coffee-medium" />
              <span className="ml-2 text-xl font-display font-bold text-coffee-dark">
                Beanmart Admin
              </span>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md smooth-transition ${
                      isActive
                        ? 'bg-coffee-medium text-cream'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-cream' : 'text-muted-foreground'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.full_name}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {user.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}