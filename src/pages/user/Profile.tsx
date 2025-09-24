import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/auth";
import { usersApi, authApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar } from "lucide-react";

const profileFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UserProfile() {
  const { user, setAuth, token } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch fresh user data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (token) {
          const profileResponse = await authApi.getProfile(token);
          // Update the auth store with fresh data
          setAuth(profileResponse, token);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token, setAuth]);

  // Split full name into first and last name for display purposes
  const getFirstAndLastName = (fullName: string = "") => {
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return { firstName: names[0], lastName: "" };
    }
    const firstName = names[0];
    const lastName = names.slice(1).join(" ");
    return { firstName, lastName };
  };

  const { firstName, lastName } = getFirstAndLastName(user?.full_name);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    mode: "onChange",
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (!user || !token) {
        throw new Error("User not authenticated");
      }
      
      // Call API to update user profile
      const response = await usersApi.updateUser(user.id, {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
      });
      
      // Update the user in the auth store
      if (response.success && response.data) {
        const updatedUser = {
          ...user,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
        };
        setAuth(updatedUser, token);
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        
        setIsEditing(false);
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              {...field} 
                              disabled={!isEditing}
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              {...field} 
                              type="email"
                              disabled={!isEditing}
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              {...field} 
                              type="tel"
                              disabled={!isEditing}
                              className="pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Member since {user?.created_at 
                        ? new Date(user?.created_at).toLocaleDateString() 
                        : "Unknown"}
                    </span>
                  </div>
                  
                  {isEditing && (
                    <Button type="submit">
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}