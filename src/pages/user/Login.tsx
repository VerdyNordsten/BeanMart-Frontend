import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { formatAPIError } from "@/lib/api-client";
import { ArrowRight } from "lucide-react";
import { AuthCard } from "@/features/auth/AuthCard";
import { LoginForm, type LoginFormData } from "@/features/auth/LoginForm";

export default function UserLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isAdmin: isUserAdmin, setAuth } = useAuthStore();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated && !isUserAdmin) {
    return <Navigate to="/user" replace />;
  }

  // Redirect admins to admin panel
  if (isAuthenticated && isUserAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
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
        userType = payload.type || "user";
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
        Object.entries(apiError.details).forEach(([_field, _messages]) => {
          // Note: We can't set form errors here since the form is in the LoginForm component
          // The error handling will be done through toast notifications instead
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

  const footer = (
    <>
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
    </>
  );

  return (
    <AuthCard
      title="Customer Login"
      description="Sign in to access your account"
      footer={footer}
    >
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        emailPlaceholder="your@email.com"
        submitButtonText="Sign In"
      />
    </AuthCard>
  );
}