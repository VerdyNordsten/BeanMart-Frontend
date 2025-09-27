import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface UserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  created_at?: string;
  is_active?: boolean;
}

interface AccountInfoProps {
  user: UserData | null;
}

export function AccountInfo({ user }: AccountInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Your profile details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span>
                {user?.created_at 
                  ? new Date(user.created_at).toLocaleDateString() 
                  : "Unknown"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account status</span>
              <span className={user?.is_active ? "text-green-600" : "text-red-600"}>
                {user?.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
