import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Label } from "@/ui/label";
import { Switch } from "@/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { useToast } from "@/hooks/use-toast";
import { productsApi, productVariantsApi, variantImagesApi, categoriesApi, roastLevelsApi, productRelationsApi } from "@/lib/api";
import { ImageUpload } from "./ImageUpload";
import type { Product, ProductFormData, Category, RoastLevel } from "@/types/product";

// Validation schema
const productSchema = z.object({
  product: z.object({
    slug: z.string().min(1, 'Slug is required'),
  name: z.string().min(1, 'Product name is required'),
    short_description: z.string().optional(),
  long_description: z.string().optional(),
    currency: z.string().min(1, 'Currency is required'),
    is_active: z.boolean(),
  }),
  categories: z.array(z.string()).optional(),
  roastLevels: z.array(z.string()).optional(),
  variants: z.array(z.object({
    id: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    compare_at_price: z.number().min(0, 'Compare at price must be positive').optional(),
    stock: z.number().min(0, 'Stock must be non-negative'),
    weight_gram: z.number().min(0, 'Weight must be positive').optional(),
  is_active: z.boolean(),
    images: z.array(z.object({
      id: z.string().optional(),
      url: z.string().optional(),
      imageData: z.string().optional(),
      position: z.number().min(1, 'Position must be at least 1'),
    })),
  })).min(1, 'At least one variant is required'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product: {
        slug: '',
        name: '',
        short_description: '',
        long_description: '',
        currency: 'USD',
        is_active: true,
      },
      categories: [],
      roastLevels: [],
      variants: [{
        price: 0,
        compare_at_price: 0,
        stock: 0,
        weight_gram: 0,
        is_active: true,
        images: [],
      }],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariantField } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const watchedName = form.watch('product.name');

  // Fetch categories and roast levels
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
  });

  const { data: roastLevelsResponse } = useQuery({
    queryKey: ['roast-levels'],
    queryFn: () => roastLevelsApi.getAllRoastLevels(),
  });

  const categories = categoriesResponse?.data || [];
  const roastLevels = roastLevelsResponse?.data || [];

  // Generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = watchedName
      .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('product.slug', slug);
    }
  }, [watchedName, isEditing, form]);

  // Load product data for editing
  useEffect(() => {
    if (product && isEditing) {
      const formData: ProductFormValues = {
        product: {
          slug: product.slug,
          name: product.name,
          short_description: product.short_description || "",
          long_description: product.long_description || "",
          currency: product.currency,
          is_active: product.is_active,
        },
        categories: product.categories?.map((cat: { category_id?: string; id?: string }) => cat.category_id || cat.id || "") || [],
        roastLevels: product.roastLevels?.map((roast: { roast_level_id?: string; id?: string }) => roast.roast_level_id || roast.id || "") || [],
        variants: product.variants?.map(variant => ({
          id: variant.id,
          price: Number(variant.price),
          compare_at_price: variant.compare_at_price ? Number(variant.compare_at_price) : undefined,
          stock: Number(variant.stock),
          weight_gram: variant.weight_gram ? Number(variant.weight_gram) : undefined,
          is_active: variant.is_active,
          images: variant.images?.map(img => ({
            id: img.id,
            url: img.url,
            position: img.position,
          })) || [],
        })) || [{
          price: 0,
          compare_at_price: 0,
          stock: 0,
          weight_gram: 0,
          is_active: true,
          images: [],
        }],
      };
      form.reset(formData);
    }
  }, [product, isEditing, form]);

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Create product
      const productResponse = await productsApi.createProduct(data.product);
      if (!productResponse.success || !productResponse.data) {
        throw new Error('Failed to create product');
      }
      const productId = productResponse.data.id;

      // Create variants and images
      for (const variantData of data.variants) {
        const variantResponse = await productVariantsApi.createVariant({
          product_id: productId,
          price: variantData.price,
          compare_at_price: variantData.compare_at_price,
          stock: variantData.stock,
          weight_gram: variantData.weight_gram,
          is_active: variantData.is_active,
        });

        if (!variantResponse.success || !variantResponse.data) {
          throw new Error('Failed to create variant');
        }
        const variantId = variantResponse.data.id;

        // Upload images for this variant
        for (const imageData of variantData.images) {
          if (imageData.url || imageData.imageData) {
            const formData = new FormData();
            if (imageData.url) {
              formData.append('url', imageData.url);
            } else if (imageData.imageData) {
              formData.append('imageData', imageData.imageData);
            }
            formData.append('variant_id', variantId);
            formData.append('position', imageData.position.toString());

            await variantImagesApi.uploadAdvanced(formData);
          }
        }
      }

      // Save product relations (categories and roast levels)
      if (data.categories && data.categories.length > 0 || data.roastLevels && data.roastLevels.length > 0) {
        await productRelationsApi.updateProductRelations(productId, {
          categories: data.categories || [],
          roastLevels: data.roastLevels || [],
        });
      }

      return productResponse.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
        toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create product',
        variant: 'destructive',
      });
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      if (!product?.id) {
        throw new Error('Product ID is required for update');
      }

      // Update product
      await productsApi.updateProduct(product.id, data.product);

      // Get current variants to compare with updated ones
      const currentProductResponse = await productsApi.getProduct(product.id);
      if (!currentProductResponse.success || !currentProductResponse.data) {
        throw new Error('Failed to fetch current product data');
      }
      const currentVariants = currentProductResponse.data.variants || [];

      // Identify variants to delete (those that exist in current but not in updated data)
      const updatedVariantIds = data.variants
        .filter(variant => variant.id)  // Only existing variants have IDs
        .map(variant => variant.id);
        
      const variantsToDelete = currentVariants.filter(
        (currentVariant: { id: string }) => !updatedVariantIds.includes(currentVariant.id)
      );

      // Delete removed variants
      for (const variantToDelete of variantsToDelete) {
        await productVariantsApi.deleteVariant(variantToDelete.id);
      }

      // Process each variant in the updated data
      for (const variantData of data.variants) {
        if (variantData.id) {
          // Update existing variant
          await productVariantsApi.updateVariant(variantData.id, {
            price: variantData.price,
            compare_at_price: variantData.compare_at_price,
            stock: variantData.stock,
            weight_gram: variantData.weight_gram,
            is_active: variantData.is_active,
          });

          // Get current images for this variant to compare with new ones
          const currentVariant = currentVariants.find(
            (v: { id: string; images?: Array<{ id: string }> }) => v.id === variantData.id
          );
          const currentImages = currentVariant?.images || [];

          // Identify images to delete (those that exist in current but not in updated data)
          const updatedImageIds = variantData.images
            .filter(img => img.id) // Only existing images have IDs
            .map(img => img.id);
            
          const imagesToDelete = currentImages.filter(
            (img: { id: string }) => !updatedImageIds.includes(img.id)
          );

          // Delete images that are no longer needed
          for (const imgToDelete of imagesToDelete) {
            await variantImagesApi.deleteImage(imgToDelete.id);
          }

          // Upload new images (those without an ID)
          for (const imageData of variantData.images) {
            if (!imageData.id && (imageData.url || imageData.imageData)) {
              // Upload new image
              const formData = new FormData();
              if (imageData.url) {
                formData.append('url', imageData.url);
              } else if (imageData.imageData) {
                formData.append('imageData', imageData.imageData);
              }
              formData.append('variantId', variantData.id);
              formData.append('position', imageData.position.toString());

              await variantImagesApi.uploadAdvanced(formData);
            }
          }
        } else {
          // Create new variant
          const variantResponse = await productVariantsApi.createVariant({
            product_id: product.id,
            price: variantData.price,
            compare_at_price: variantData.compare_at_price,
            stock: variantData.stock,
            weight_gram: variantData.weight_gram,
            is_active: variantData.is_active,
          });

          if (!variantResponse.success || !variantResponse.data) {
            throw new Error('Failed to create variant');
          }
          const variantId = variantResponse.data.id;

          // Upload images for new variant
          for (const imageData of variantData.images) {
            if (imageData.url || imageData.imageData) {
              const formData = new FormData();
              if (imageData.url) {
                formData.append('url', imageData.url);
              } else if (imageData.imageData) {
                formData.append('imageData', imageData.imageData);
              }
              formData.append('variant_id', variantId);
              formData.append('position', imageData.position.toString());

              await variantImagesApi.uploadAdvanced(formData);
            }
          }
        }
      }

      // Update product relations (categories and roast levels)
      await productRelationsApi.updateProductRelations(product.id, {
        categories: data.categories || [],
        roastLevels: data.roastLevels || [],
      });

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update product',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    // Validate data
    if (!data.product || !data.variants || data.variants.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Product and variants data are required',
        variant: 'destructive',
      });
      return;
    }

    // Validate variants
    for (const variant of data.variants) {
      if (variant.price === undefined || variant.stock === undefined) {
        toast({
          title: 'Validation Error',
          description: 'Price and stock are required for all variants',
          variant: 'destructive',
        });
        return;
      }
    }

    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addVariant = () => {
    appendVariant({
      price: 0,
      compare_at_price: 0,
      stock: 0,
      weight_gram: 0,
      is_active: true,
      images: [],
    });
  };

  const removeVariant = (index: number) => {
    if (variantFields.length > 1) {
      removeVariantField(index);
    }
  };

  return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product.slug">Slug</Label>
              <Input
                id="product.slug"
                {...form.register('product.slug')}
                placeholder="product-slug"
              />
            </div>
            <div>
              <Label htmlFor="product.name">Product Name</Label>
              <Input
                id="product.name"
                {...form.register('product.name')}
                placeholder="Product name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="product.short_description">Short Description</Label>
                  <Textarea 
              id="product.short_description"
              {...form.register('product.short_description')}
              placeholder="Brief product description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="product.long_description">Long Description</Label>
            <Textarea
              id="product.long_description"
              {...form.register('product.long_description')}
              placeholder="Detailed product description&#10;&#10;Supports formatting:&#10;**Bold text** for bold&#10;*Italic text* for italic&#10;`Code` for inline code&#10;- Bullet points&#10;1. Numbered lists"
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports basic formatting: **bold**, *italic*, `code`, bullet points (-), and numbered lists (1.)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product.currency">Currency</Label>
              <Select
                value={form.watch('product.currency')}
                onValueChange={(value) => form.setValue('product.currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="IDR">IDR</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="product.is_active"
                checked={form.watch('product.is_active')}
                onCheckedChange={(checked) => form.setValue('product.is_active', checked)}
              />
              <Label htmlFor="product.is_active">Active</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories and Roast Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Categories & Roast Levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categories">Categories</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  const currentCategories = form.getValues('categories') || [];
                  if (!currentCategories.includes(value)) {
                    form.setValue('categories', [...currentCategories, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {(form.watch('categories') || []).map((categoryId: string) => {
                  const category = categories.find((cat: Category) => cat.id === categoryId);
                  return (
                    <div key={categoryId} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {category?.name}
                      <button
                        type="button"
                        onClick={() => {
                          const currentCategories = form.getValues('categories') || [];
                          form.setValue('categories', currentCategories.filter(id => id !== categoryId));
                        }}
                        className="ml-1 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="roastLevels">Roast Levels</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  const currentRoastLevels = form.getValues('roastLevels') || [];
                  if (!currentRoastLevels.includes(value)) {
                    form.setValue('roastLevels', [...currentRoastLevels, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select roast levels" />
                </SelectTrigger>
                <SelectContent>
                  {roastLevels.map((roastLevel: RoastLevel) => (
                    <SelectItem key={roastLevel.id} value={roastLevel.id}>
                      {roastLevel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {(form.watch('roastLevels') || []).map((roastLevelId: string) => {
                  const roastLevel = roastLevels.find((roast: RoastLevel) => roast.id === roastLevelId);
                  return (
                    <div key={roastLevelId} className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                      {roastLevel?.name}
                      <button
                        type="button"
                        onClick={() => {
                          const currentRoastLevels = form.getValues('roastLevels') || [];
                          form.setValue('roastLevels', currentRoastLevels.filter(id => id !== roastLevelId));
                        }}
                        className="ml-1 hover:text-orange-600"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {variantFields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Variant {index + 1}</h4>
                {variantFields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVariant(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor={`variants.${index}.price`}>Price</Label>
                  <Input
                    id={`variants.${index}.price`}
                    type="number"
                    step="0.01"
                    {...form.register(`variants.${index}.price`, { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.variants?.[index]?.price && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.variants[index]?.price?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`variants.${index}.compare_at_price`}>Compare At Price</Label>
                  <Input
                    id={`variants.${index}.compare_at_price`}
                    type="number"
                    step="0.01"
                    {...form.register(`variants.${index}.compare_at_price`, { valueAsNumber: true })}
                    placeholder="0.00"
            />
          </div>

                <div>
                  <Label htmlFor={`variants.${index}.stock`}>Stock</Label>
                  <Input
                    id={`variants.${index}.stock`}
                    type="number"
                    {...form.register(`variants.${index}.stock`, { valueAsNumber: true })}
                    placeholder="0"
                  />
                  {form.formState.errors.variants?.[index]?.stock && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.variants[index]?.stock?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`variants.${index}.weight_gram`}>Weight (grams)</Label>
                  <Input
                    id={`variants.${index}.weight_gram`}
                    type="number"
                    {...form.register(`variants.${index}.weight_gram`, { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                  </div>

              <div className="flex items-center space-x-2 mb-4">
                    <Switch
                  id={`variants.${index}.is_active`}
                  checked={form.watch(`variants.${index}.is_active`)}
                  onCheckedChange={(checked) => form.setValue(`variants.${index}.is_active`, checked)}
                />
                <Label htmlFor={`variants.${index}.is_active`}>Active</Label>
              </div>

              {/* Images for this variant */}
              <div>
                <Label>Images</Label>
                <ImageUpload
                  images={form.watch(`variants.${index}.images`) || []}
                  onImagesChange={(images) => form.setValue(`variants.${index}.images`, images)}
                  variantId={form.watch(`variants.${index}.id`)}
            />
          </div>
            </Card>
          ))}

          <Button type="button" onClick={addVariant} variant="outline">
            Add Variant
          </Button>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
            <Button
              type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
  );
}