import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { formatAPIError } from '@/lib/api-client';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm, type LoginFormData } from '@/components/auth/LoginForm';

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setAuth } = useAuthStore();
  const { toast } = useToast();

  // Redirect if already authenticated as admin
  if (user && user.role === 'admin' && user.is_active) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.login({ email: data.email, password: data.password, isAdmin: true }); // isAdmin = true for admin panel
      
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
      
      // Check if user is admin from the token type
      if (userType !== 'admin') {
        toast({
          title: "Access Denied",
          description: `You don't have permission to access the admin panel. Your role is: ${userType}`,
          variant: "destructive",
        });
        return;
      }
      
      // Use the user data from the login response (it should contain the user object)
      const userData = response.data;
      if (!userData) {
        toast({
          title: "Login Error",
          description: "User data not found in response.",
          variant: "destructive",
        });
        return;
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
      
      // Set the auth state with user data and token
      setAuth(userForStore, token);
      
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

  return (
    <AuthCard
      title="Admin Login"
      description="Sign in to access the Beanmart admin panel"
    >
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        emailPlaceholder="admin@beanmart.com"
        submitButtonText="Sign In"
        submitButtonVariant="coffee"
      />
    </AuthCard>
  );
}