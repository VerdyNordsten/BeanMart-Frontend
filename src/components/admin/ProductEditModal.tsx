import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { combinedProductsApi } from '@/lib/api';
import { ProductForm } from './ProductForm';

interface ProductEditModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductEditModal({ productId, isOpen, onClose, onSuccess }: ProductEditModalProps) {
  const [productData, setProductData] = useState<Record<string, unknown> | null>(null);

  // Fetch product data when modal opens
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-details', productId],
    queryFn: () => combinedProductsApi.getProductWithVariantsAndImages(productId!),
    enabled: !!productId && isOpen,
  });

  useEffect(() => {
    if (product?.data) {
      setProductData(product.data);
    }
  }, [product]);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] w-[95vw] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="font-display text-xl text-coffee-dark">
            Edit Product
          </DialogTitle>
          <DialogDescription>
            Update product information, variants, and images
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading product data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error loading product data</p>
              <Button variant="outline" onClick={onClose} className="mt-4">
                Close
              </Button>
            </div>
          ) : productData ? (
            <ProductForm 
              product={productData} 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
