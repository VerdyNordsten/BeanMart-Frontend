import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  Coffee, 
  User, 
  LogOut, 
  ShoppingBag,
  MapPin,
  CreditCard
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/auth';
import { useCartStore } from '@/lib/cart';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Story', href: '/story' },
  { name: 'Brew Guides', href: '/brew-guides' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems, openCart } = useCartStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Coffee className="h-8 w-8 text-coffee-medium" />
          <span className="font-display text-2xl font-bold text-coffee-dark">
            Beanmart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium smooth-transition hover:text-coffee-medium ${
                location.pathname === item.href
                  ? 'text-coffee-medium'
                  : 'text-foreground/80'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-coffee-medium text-cream text-xs flex items-center justify-center">
              {getTotalItems()}
            </span>
            <span className="sr-only">Shopping cart</span>
          </Button>

          {/* User menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === "admin" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <User className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/user/orders">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/addresses">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Addresses</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/payment-methods">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Payment Methods</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="flex items-center space-x-2 pb-4 border-b">
                  <Coffee className="h-6 w-6 text-coffee-medium" />
                  <span className="font-display text-xl font-bold text-coffee-dark">
                    Beanmart
                  </span>
                </Link>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium smooth-transition hover:text-coffee-medium ${
                      location.pathname === item.href
                        ? 'text-coffee-medium'
                        : 'text-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      {user?.role === "admin" ? (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="block text-lg font-medium"
                        >
                          Admin Dashboard
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/user/orders"
                            onClick={() => setIsOpen(false)}
                            className="block text-lg font-medium"
                          >
                            My Orders
                          </Link>
                          <Link
                            to="/user/profile"
                            onClick={() => setIsOpen(false)}
                            className="block text-lg font-medium"
                          >
                            Profile
                          </Link>
                          <Link
                            to="/user/addresses"
                            onClick={() => setIsOpen(false)}
                            className="block text-lg font-medium"
                          >
                            Addresses
                          </Link>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-lg"
                      asChild
                    >
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}