import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { categoriesApi } from '@/lib/api';
import { CategoryForm } from '@/components/admin/CategoryForm';
import type { Category } from '@/types/product';

export default function AdminCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  // Fetch categories
  const {
    data: categoriesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAllCategories();
      return response;
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      await categoriesApi.deleteCategory(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category',
        variant: 'destructive',
      });
    },
  });

  // Filter categories
  const filteredCategories = categoriesResponse?.data?.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDeleteCategory = (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCloseEdit = () => {
    setEditingCategory(null);
  };

  const handleCloseCreate = () => {
    setShowCreateForm(false);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    setEditingCategory(null);
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading categories...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error loading categories</h1>
          <p className="text-gray-600 mb-4">Failed to load categories. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category: Category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <p className="text-sm text-gray-600">{category.slug}</p>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={deleteCategoryMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No categories message */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding your first category.'}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onClose={handleCloseEdit}
          onSuccess={handleSuccess}
        />
      )}

      {/* Create Modal */}
      {showCreateForm && (
        <CategoryForm
          onClose={handleCloseCreate}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}