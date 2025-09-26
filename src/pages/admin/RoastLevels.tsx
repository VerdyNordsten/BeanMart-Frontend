import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/auth';
import { roastLevelsApi } from '@/lib/api';
import { RoastLevelForm } from '@/components/admin/RoastLevelForm';
import type { RoastLevel } from '@/types/product';

export default function AdminRoastLevels() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRoastLevel, setEditingRoastLevel] = useState<RoastLevel | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch roast levels
  const {
    data: roastLevelsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-roast-levels'],
    queryFn: async () => {
      const response = await roastLevelsApi.getAllRoastLevels();
      return response;
    },
    enabled: isAuthenticated, // Only run query if authenticated
  });

  // Delete roast level mutation
  const deleteRoastLevelMutation = useMutation({
    mutationFn: async (roastLevelId: string) => {
      await roastLevelsApi.deleteRoastLevel(roastLevelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roast-levels'] });
      toast({
        title: 'Success',
        description: 'Roast level deleted successfully',
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete roast level';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Filter roast levels
  const filteredRoastLevels = roastLevelsResponse?.data?.filter((roastLevel: RoastLevel) =>
    roastLevel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    roastLevel.slug.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDeleteRoastLevel = (roastLevel: RoastLevel) => {
    if (window.confirm(`Are you sure you want to delete "${roastLevel.name}"?`)) {
      deleteRoastLevelMutation.mutate(roastLevel.id);
    }
  };

  const handleEditRoastLevel = (roastLevel: RoastLevel) => {
    setEditingRoastLevel(roastLevel);
  };

  const handleCloseEdit = () => {
    setEditingRoastLevel(null);
  };

  const handleCloseCreate = () => {
    setShowCreateForm(false);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-roast-levels'] });
    setEditingRoastLevel(null);
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
          <h1 className="text-2xl font-bold mb-4">Loading roast levels...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-600 mb-4">
            Failed to load roast levels. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Roast Levels Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          Create New Roast Level
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search roast levels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingRoastLevel) && (
        <div className="mb-6">
          <RoastLevelForm
            roastLevel={editingRoastLevel || undefined}
            onSuccess={handleSuccess}
            onCancel={editingRoastLevel ? handleCloseEdit : handleCloseCreate}
          />
        </div>
      )}

      {/* Roast Levels List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoastLevels.map((roastLevel: RoastLevel) => (
          <Card key={roastLevel.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{roastLevel.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Slug:</span>
                  <span className="ml-2 text-gray-600">{roastLevel.slug}</span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(roastLevel.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRoastLevel(roastLevel)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRoastLevel(roastLevel)}
                    disabled={deleteRoastLevelMutation.isPending}
                  >
                    {deleteRoastLevelMutation.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoastLevels.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchQuery ? 'No roast levels found matching your search.' : 'No roast levels found.'}
          </p>
        </div>
      )}
    </div>
  );
}
