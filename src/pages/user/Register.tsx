import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { formatAPIError } from "@/lib/api-client";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm, type RegisterFormData } from "@/components/auth/RegisterForm";

export default function UserRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated && user?.role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  // Redirect admins to admin panel
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      // Register the user
      const response = await authApi.register(data.email, data.password, data.fullName, data.phone);
      
      // Handle the token field name difference
      const token = response.accessToken || response.token;
      if (!token) {
        toast({
          title: "Registration Error",
          description: "Authentication token not found in response.",
          variant: "destructive",
        });
        return;
      }
      
      // Get user profile using the token
      const profileResponse = await authApi.getProfile();
      
      // Create user object compatible with authStore
      const userForStore = {
        id: profileResponse.id,
        email: profileResponse.email,
        full_name: profileResponse.full_name || profileResponse.fullName,
        phone: profileResponse.phone,
        role: 'user' as 'admin' | 'user',
        is_active: profileResponse.is_active !== undefined ? profileResponse.is_active : true
      };
      
      // Set authentication state
      setAuth(userForStore, token);
      
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const apiError = formatAPIError(error);
      
      if (error.response?.status === 409) {
        toast({
          title: "Registration Failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
      } else if (apiError.details) {
        // Set field-specific errors
        Object.entries(apiError.details).forEach(([field, messages]) => {
          // Note: We can't set form errors here since the form is in the RegisterForm component
          // The error handling will be done through toast notifications instead
        });
      } else {
        toast({
          title: "Registration Failed",
          description: apiError.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <p className="text-muted-foreground">
      Already have an account?{" "}
      <Link to="/login" className="text-primary hover:underline">
        Sign in
      </Link>
    </p>
  );

  return (
    <AuthCard
      title="Create Account"
      description="Sign up to access your account"
      footer={footer}
    >
      <RegisterForm
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </AuthCard>
  );
}