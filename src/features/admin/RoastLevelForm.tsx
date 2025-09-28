import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { useToast } from "@/hooks/use-toast";
import { roastLevelsApi } from "@/lib/api";
import type { RoastLevel } from "@/types";

// Validation schema
const roastLevelSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  name: z.string().min(1, 'Roast level name is required'),
});

type RoastLevelFormValues = z.infer<typeof roastLevelSchema>;

interface RoastLevelFormProps {
  roastLevel?: RoastLevel;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RoastLevelForm({ roastLevel, onSuccess, onCancel }: RoastLevelFormProps) {
  const { toast } = useToast();
  const isEditing = Boolean(roastLevel);
  
  const form = useForm<RoastLevelFormValues>({
    resolver: zodResolver(roastLevelSchema),
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

  // Load roast level data for editing
  useEffect(() => {
    if (roastLevel && isEditing) {
      form.reset({
        slug: roastLevel.slug,
        name: roastLevel.name,
      });
    }
  }, [roastLevel, isEditing, form]);

  // Create roast level mutation
  const createMutation = useMutation({
    mutationFn: async (data: RoastLevelFormValues) => {
      const response = await roastLevelsApi.createRoastLevel(data);
      if (!response.success || !response.data) {
        throw new Error('Failed to create roast level');
      }
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Roast level created successfully',
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create roast level',
        variant: 'destructive',
      });
    },
  });

  // Update roast level mutation
  const updateMutation = useMutation({
    mutationFn: async (data: RoastLevelFormValues) => {
      if (!roastLevel) throw new Error('No roast level to update');
      const response = await roastLevelsApi.updateRoastLevel(roastLevel.id, data);
      if (!response.success || !response.data) {
        throw new Error('Failed to update roast level');
      }
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Roast level updated successfully',
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update roast level',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: RoastLevelFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Roast Level' : 'Create New Roast Level'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Roast Level Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="e.g., Light Roast"
              disabled={isLoading}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...form.register('slug')}
              placeholder="e.g., light-roast"
              disabled={isLoading}
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-red-600">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
