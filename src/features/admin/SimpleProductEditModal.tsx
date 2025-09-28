import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Loader2 } from "lucide-react";
import { productsApi } from "@/lib/api";
import { ProductForm } from "./ProductForm";
import type { Product } from "@/types/product";

interface SimpleProductEditModalProps {
  product: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SimpleProductEditModal({ product, onClose, onSuccess }: SimpleProductEditModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Fetch complete product data with variants and images
  const {
    data: productResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', product.id],
    queryFn: async () => {
      const response = await productsApi.getProduct(product.id);
      return response;
    },
    enabled: !!product.id,
  });

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product information, variants, and images
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading product data...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error loading product data</h3>
            <p className="text-gray-600 mb-4">Failed to load product details. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {productResponse?.success && productResponse.data && (
          <ProductForm
            product={productResponse.data}
            onSuccess={handleSuccess}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}