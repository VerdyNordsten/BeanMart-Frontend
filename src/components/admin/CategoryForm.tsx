import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { categoriesApi } from '@/lib/api';
import type { Category, CategoryFormData } from '@/types/product';

// Validation schema
const categorySchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  name: z.string().min(1, 'Category name is required'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const { toast } = useToast();
  const isEditing = !!category;
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      slug: '',
      name: '',
    },
  });

  const watchedName = form.watch('name');

  // Generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  }, [watchedName, isEditing, form]);

  // Load category data for editing
  useEffect(() => {
    if (category && isEditing) {
      form.reset({
        slug: category.slug,
        name: category.name,
      });
    }
  }, [category, isEditing, form]);

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await categoriesApi.createCategory(data);
      if (!response.success || !response.data) {
        throw new Error('Failed to create category');
      }
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      if (!category?.id) {
        throw new Error('Category ID is required for update');
      }
      const response = await categoriesApi.updateCategory(category.id, data);
      if (!response.success || !response.data) {
        throw new Error('Failed to update category');
      }
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...form.register('slug')}
              placeholder="category-slug"
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Category name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}