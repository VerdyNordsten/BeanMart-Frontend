import { OrderCard } from "./OrderCard";
import { Order } from "@/types";
import { LoadingCard } from "@/shared/LoadingCard";
import { EmptyState } from "@/shared/EmptyState";
import { ErrorState } from "@/shared/ErrorState";
import { Package } from "lucide-react";

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onViewDetails: (order: Order) => void;
  onRetry: () => void;
}

export function OrdersList({ orders, loading, error, onViewDetails, onRetry }: OrdersListProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load orders"
        description={error}
        onRetry={onRetry}
      />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders found"
        description="You haven't placed any orders yet. Start shopping to see your orders here."
        actionText="Browse Products"
        actionHref="/catalog"
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
