import { ReactNode } from "react";
import { useAuthStore } from "@/lib/auth";
import { Navigate, Outlet } from "react-router-dom";

interface UserLayoutProps {
  children?: ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to admin panel if user is admin
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6">
        {children || <Outlet />}
      </main>
    </div>
  );
}