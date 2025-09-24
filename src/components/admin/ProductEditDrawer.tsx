import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, X } from 'lucide-react';
import { combinedProductsApi } from '@/lib/api';
import { ProductForm } from './ProductForm';
import { useMediaQuery } from '@/hooks/use-mobile';

interface ProductEditDrawerProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductEditDrawer({ productId, isOpen, onClose, onSuccess }: ProductEditDrawerProps) {
  const [productData, setProductData] = useState<any>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  const content = (
    <div className="p-6">
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
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-display text-xl text-coffee-dark">
                Edit Product
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <ScrollArea className="flex-1">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
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
        <ScrollArea className="max-h-[calc(90vh-80px)]">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
