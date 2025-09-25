import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { formatAPIError } from "@/lib/api-client";
import { Coffee, Loader2, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function UserLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, isAdmin: isUserAdmin, setAuth } = useAuthStore();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated && !isUserAdmin) {
    return <Navigate to="/user" replace />;
  }

  // Redirect admins to admin panel
  if (isAuthenticated && isUserAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      // For user login, we don't set isAdmin flag
      const response = await authApi.login({ email: data.email, password: data.password, isAdmin: false });
      
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
      
      // Use the user data from the login response
      const userData = response.data;
      if (!userData) {
        toast({
          title: "Login Error",
          description: "User data not found in response.",
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
      
      // Create user object compatible with authStore
      const userForStore = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name || userData.fullName,
        phone: userData.phone,
        role: userType as 'admin' | 'user',
        is_active: userData.is_active !== undefined ? userData.is_active : true
      };
      
      // Check if the user is an admin
      if (userType === "admin") {
        toast({
          title: "Admin Account Detected",
          description: "You have admin privileges. You can access the admin panel.",
        });
      }
      
      // Set authentication state
      setAuth(userForStore, token);
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });
      
    } catch (error: unknown) {
      console.error("Login error:", error);
      const apiError = formatAPIError(error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      } else if (apiError.details) {
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
            Customer Login
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to access your account
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
                        placeholder="your@email.com"
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
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
            <p className="mt-2 text-muted-foreground">
              Are you an admin?{" "}
              <Link to="/admin/login" className="text-primary hover:underline">
                Admin login
                <ArrowRight className="ml-1 h-4 w-4 inline" />
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}