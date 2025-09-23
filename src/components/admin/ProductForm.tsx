import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { productsApi } from '@/lib/api';
import { formatAPIError } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_description: z.string().min(1, 'Short description is required'),
  long_description: z.string().optional(),
  origin: z.string().optional(),
  roast_level: z.enum(['light', 'medium', 'dark']),
  tasting_notes: z.string().optional(),
  processing_method: z.string().optional(),
  altitude: z.string().optional(),
  producer: z.string().optional(),
  harvest_date: z.string().optional(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

type ProductForm = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const isEditing = !!product;

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      short_description: product?.short_description || '',
      long_description: product?.long_description || '',
      origin: product?.origin || '',
      roast_level: product?.roast_level || 'medium',
      tasting_notes: product?.tasting_notes?.join(', ') || '',
      processing_method: product?.processing_method || '',
      altitude: product?.altitude || '',
      producer: product?.producer || '',
      harvest_date: product?.harvest_date || '',
      is_featured: product?.is_featured || false,
      is_active: product?.is_active !== undefined ? product.is_active : true,
    },
  });

  // Generate slug from name
  const watchedName = form.watch('name');
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when name changes (only for new products)
  if (!isEditing && watchedName && !form.getValues('slug')) {
    form.setValue('slug', generateSlug(watchedName));
  }

  const createMutation = useMutation({
    mutationFn: (data: any) => productsApi.createProduct(data),
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "The product has been successfully created.",
      });
      onSuccess();
    },
    onError: (error) => {
      const apiError = formatAPIError(error);
      
      if (apiError.details) {
        Object.entries(apiError.details).forEach(([field, messages]) => {
          form.setError(field as keyof ProductForm, {
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        toast({
          title: "Create failed",
          description: apiError.message,
          variant: "destructive",
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => productsApi.updateProduct(product.id, data),
    onSuccess: () => {
      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      });
      onSuccess();
    },
    onError: (error) => {
      const apiError = formatAPIError(error);
      
      if (apiError.details) {
        Object.entries(apiError.details).forEach(([field, messages]) => {
          form.setError(field as keyof ProductForm, {
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        toast({
          title: "Update failed",
          description: apiError.message,
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: ProductForm) => {
    const formattedData = {
      ...data,
      tasting_notes: data.tasting_notes ? data.tasting_notes.split(',').map(note => note.trim()) : [],
    };

    if (isEditing) {
      updateMutation.mutate(formattedData);
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ethiopian Yirgacheffe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ethiopian-yirgacheffe" />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version of the product name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Brief description of the coffee..."
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="long_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Detailed description of the coffee, origin story, brewing notes..."
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ethiopia, Yirgacheffe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roast_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roast Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roast level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light Roast</SelectItem>
                      <SelectItem value="medium">Medium Roast</SelectItem>
                      <SelectItem value="dark">Dark Roast</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tasting_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasting Notes</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Floral, Citrus, Bergamot (comma-separated)" />
                </FormControl>
                <FormDescription>
                  Enter tasting notes separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="processing_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Method</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Washed, Natural, Honey" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="altitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altitude</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1,700-2,200m" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="producer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Farm or cooperative name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="harvest_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harvest Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center space-x-6">
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Product</FormLabel>
                    <FormDescription>
                      Display this product in featured sections
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Make this product available for purchase
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              variant="coffee"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}