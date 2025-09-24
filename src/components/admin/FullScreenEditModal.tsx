import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, X } from 'lucide-react';
import { combinedProductsApi } from '@/lib/api';
import { ProductForm } from './ProductForm';

interface FullScreenEditModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FullScreenEditModal({ productId, isOpen, onClose, onSuccess }: FullScreenEditModalProps) {
  const [productData, setProductData] = useState<any>(null);

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
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 m-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="font-display text-xl text-coffee-dark">
                  Edit Product
                </DialogTitle>
                <DialogDescription>
                  Update product information, variants, and images
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-6 py-4">
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
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
