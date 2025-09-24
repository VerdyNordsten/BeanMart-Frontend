import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore, isAdmin } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { formatAPIError } from '@/lib/api-client';
import { Coffee, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setAuth } = useAuthStore();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated as admin
  if (user && isAdmin(user)) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', data);
      const response = await authApi.login(data.email, data.password, true); // isAdmin = true for admin panel
      console.log('Login response:', response);
      
      // Handle the token field name difference
      const token = response.accessToken || response.token;
      if (!token) {
        toast({
          title: "Login Error",
          description: "Authentication token not found in response.",
          variant: "destructive",
        });
        return;
      }
      
      // Decode token to get user type (admin/user)
      let userType = 'user';
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userType = payload.type || 'user';
      } catch (e) {
        console.error('Error decoding token:', e);
      }
      
      // Verify user profile and admin role using the token directly
      const profile = await authApi.getProfile(token);
      console.log('Profile response:', profile);
      
      // Update profile with role from token
      const profileWithRole = {
        ...profile,
        role: userType as 'admin' | 'user'
      };
      
      if (userType !== 'admin') {
        toast({
          title: "Access Denied",
          description: `You don't have permission to access the admin panel. Your role is: ${userType}`,
          variant: "destructive",
        });
        return;
      }
      
      setAuth(profileWithRole, token);
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to admin panel.",
      });
      
    } catch (error: unknown) {
      console.error('Login error:', error);
      const apiError = formatAPIError(error);
      
      if (apiError.details) {
        // Set field-specific errors
        Object.entries(apiError.details).forEach(([field, messages]) => {
          form.setError(field as keyof LoginForm, {
            message: messages[0],
          });
        });
      } else {
        toast({
          title: "Login Failed",
          description: apiError.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md card-shadow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-coffee-medium/10 rounded-full">
              <Coffee className="h-8 w-8 text-coffee-medium" />
            </div>
          </div>
          <CardTitle className="font-display text-2xl text-coffee-dark">
            Admin Login
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to access the Beanmart admin panel
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="admin@beanmart.com"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                variant="coffee" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}