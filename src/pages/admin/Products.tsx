import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules/card';
import { Badge } from '@/components/atoms/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/auth';
import { productsApi } from '@/lib/api';
import { SimpleProductEditModal } from '@/components/admin/SimpleProductEditModal';
import { SimpleProductAddModal } from '@/components/admin/SimpleProductAddModal';
import type { Product } from '@/types/product';

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const itemsPerPage = 10;

  // Fetch products
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-products-complete', currentPage, itemsPerPage, searchQuery],
    queryFn: async () => {
      const response = await productsApi.getAllProducts();
      return response;
    },
    enabled: isAuthenticated, // Only run query if authenticated
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      // Delete the product - the backend has CASCADE DELETE relationships
      // that will automatically remove associated variants and images
      await productsApi.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-complete', currentPage, itemsPerPage, searchQuery] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Filter and paginate products
  const filteredProducts = productsResponse?.data?.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProductMutation.mutate(product.id);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
  };

  const handleCloseCreate = () => {
    setShowCreateForm(false);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products-complete'] });
    setEditingProduct(null);
    setShowCreateForm(false);
  };

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading product data...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error loading product data</h1>
          <p className="text-gray-600 mb-4">Failed to load products. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product: Product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{product.slug}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {product.short_description || 'No description available'}
              </p>
              
              {/* Product Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Variants ({product.variants.length})</h4>
                  <div className="space-y-1">
                    {product.variants.slice(0, 3).map((variant) => (
                      <div key={variant.id} className="flex justify-between text-sm">
                        <span>${variant.price}</span>
                        <span className="text-gray-500">Stock: {variant.stock}</span>
                      </div>
                    ))}
                    {product.variants.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{product.variants.length - 3} more variants
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Product Images */}
              {product.images && product.images.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Images ({product.images.length})</h4>
                  <div className="flex space-x-2">
                    {product.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {product.images.length > 3 && (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                        +{product.images.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProduct(product)}
                  disabled={deleteProductMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* No products message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <SimpleProductEditModal
          product={editingProduct}
          onClose={handleCloseEdit}
          onSuccess={handleSuccess}
        />
      )}

      {/* Create Modal */}
      {showCreateForm && (
        <SimpleProductAddModal
          onClose={handleCloseCreate}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}