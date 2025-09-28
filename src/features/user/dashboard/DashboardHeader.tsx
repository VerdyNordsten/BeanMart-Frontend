import { Separator } from "@/ui/separator";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName || "Customer"}!</h1>
        <p className="text-muted-foreground">
          Manage your account, orders, and preferences
        </p>
      </div>
      <Separator />
    </>
  );
}
