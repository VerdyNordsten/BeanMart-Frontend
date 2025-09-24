import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';

interface SimpleProductAddModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function SimpleProductAddModal({ onClose, onSuccess }: SimpleProductAddModalProps) {
  const [isOpen, setIsOpen] = useState(true);

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
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product with variants and images
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          onSuccess={handleSuccess}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}