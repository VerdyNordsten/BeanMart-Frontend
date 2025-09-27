import { useState, useRef } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/tabs';
import { Card, CardContent } from '@/components/molecules/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/molecules/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { variantImagesApi } from '@/lib/api';


interface ImageUploadProps {
  images: Array<{
    id?: string;
    url?: string;
    imageData?: string;
    position: number;
  }>;
  onImagesChange: (images: Array<{
    id?: string;
    url?: string;
    imageData?: string;
    position: number;
  }>) => void;
  variantId?: string;
}

export function ImageUpload({ images, onImagesChange, variantId }: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    if (variantId) {
      // Edit mode - upload immediately
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('variant_id', variantId);
        formData.append('position', (images.length + 1).toString());

        const response = await variantImagesApi.uploadAdvanced(formData);
        
        if (response.success && response.data) {
          const newImage = {
            id: response.data.id,
            url: response.data.url,
            position: response.data.position,
          };
          onImagesChange([...images, newImage]);
          toast({
            title: 'Success',
            description: 'Image uploaded successfully',
          });
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
        toast({
          title: 'Upload failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } else {
      // Create mode - store locally as base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        const newImage = {
          imageData,
          position: images.length + 1,
        };
        onImagesChange([...images, newImage]);
        toast({
          title: 'Success',
          description: 'Image added (will be uploaded when product is saved)',
        });
      };
      reader.readAsDataURL(file);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlUpload = async () => {
    if (!urlInput.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter an image URL',
        variant: 'destructive',
      });
      return;
    }

    // Validate URL format
    try {
      new URL(urlInput.trim());
    } catch {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid image URL',
        variant: 'destructive',
      });
      return;
    }

    if (variantId) {
      // Edit mode - upload immediately via backend
      try {
        const formData = new FormData();
        formData.append('url', urlInput.trim());
        formData.append('variant_id', variantId);
        formData.append('position', (images.length + 1).toString());

        const response = await variantImagesApi.uploadAdvanced(formData);
        
        if (response.success && response.data) {
          const newImage = {
            id: response.data.id,
            url: response.data.url, // This will be the local asset URL, not the source URL
            position: response.data.position,
          };
          onImagesChange([...images, newImage]);
          setUrlInput('');
          toast({
            title: 'Success',
            description: 'Image downloaded and uploaded successfully',
          });
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      } catch (error: unknown) {
        toast({
          title: 'Upload failed',
          description: error instanceof Error ? error.message : 'Failed to download and upload image',
          variant: 'destructive',
        });
      }
    } else {
      // Create mode - create formData for later processing via backend
      const newImage = {
        url: urlInput.trim(), // Store the URL for processing later
        position: images.length + 1,
      };
      onImagesChange([...images, newImage]);
      setUrlInput('');
      toast({
        title: 'Success',
        description: 'Image URL added (will be downloaded and converted when product is saved)',
      });
    }
  };

  const handlePasteImage = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    const text = event.clipboardData?.getData('text');
    
    // Check if pasted text is a URL
    if (text) {
      try {
        const url = new URL(text);
        // Validate if it looks like an image URL (common image extensions)
        const pathname = url.pathname.toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext));
        
        // Also check common image URL patterns
        const hasImagePattern = url.pathname.includes('image') || 
                              url.pathname.includes('img') ||
                              url.hostname.includes('cdn') ||
                              url.hostname.includes('images');
        
        if (hasImageExtension || hasImagePattern) {
          event.preventDefault();
          // Treat this as URL upload
          const pastedUrl = text;
          
          if (variantId) {
            // Edit mode - upload immediately via backend
            try {
              const formData = new FormData();
              formData.append('url', pastedUrl);
              formData.append('variant_id', variantId);
              formData.append('position', (images.length + 1).toString());

              const response = await variantImagesApi.uploadAdvanced(formData);
              
              if (response.success && response.data) {
                const newImage = {
                  id: response.data.id,
                  url: response.data.url, // This will be the local asset URL, not the source URL
                  position: response.data.position,
                };
                onImagesChange([...images, newImage]);
                toast({
                  title: 'Success',
                  description: 'Image URL pasted, downloaded and uploaded successfully',
                });
              } else {
                throw new Error(response.message || 'Upload failed');
              }
            } catch (error: unknown) {
              toast({
                title: 'Upload failed',
                description: error instanceof Error ? error.message : 'Failed to download and upload pasted URL',
                variant: 'destructive',
              });
            }
          } else {
            // Create mode - store the URL for processing later
            const newImage = {
              url: pastedUrl,
              position: images.length + 1,
            };
            onImagesChange([...images, newImage]);
            toast({
              title: 'Success',
              description: 'Image URL pasted (will be downloaded and converted when product is saved)',
            });
          }
          return;
        }
      } catch {
        // Text is not a valid URL, continue with image handling
      }
    }

    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          if (variantId) {
            // Edit mode - upload immediately
            try {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('variant_id', variantId);
              formData.append('position', (images.length + 1).toString());

              const response = await variantImagesApi.uploadAdvanced(formData);
              
              if (response.success && response.data) {
                const newImage = {
                  id: response.data.id,
                  url: response.data.url,
                  position: response.data.position,
                };
                onImagesChange([...images, newImage]);
                toast({
                  title: 'Success',
                  description: 'Image pasted and uploaded successfully',
                });
              } else {
                throw new Error(response.message || 'Upload failed');
              }
            } catch (error: unknown) {
              toast({
                title: 'Upload failed',
                description: error instanceof Error ? error.message : 'Failed to upload pasted image',
                variant: 'destructive',
              });
            }
          } else {
            // Create mode - store locally as base64
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageData = e.target?.result as string;
              const newImage = {
                imageData,
                position: images.length + 1,
              };
              onImagesChange([...images, newImage]);
              toast({
                title: 'Success',
                description: 'Image pasted (will be uploaded when product is saved)',
              });
            };
            reader.readAsDataURL(file);
          }
        }
        break;
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const image = images[index];
    if (image.id) {
      // Image has ID - show confirmation dialog
      setImageToDelete(index);
      setDeleteConfirmOpen(true);
    } else {
      // Image has no ID - just remove from UI
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  const confirmDeleteImage = async () => {
    if (imageToDelete === null) return;

    const image = images[imageToDelete];
    if (image.id) {
      try {
        const response = await variantImagesApi.smartDeleteImage(image.id);
        if (response.success) {
          const newImages = images.filter((_, i) => i !== imageToDelete);
          onImagesChange(newImages);
          toast({
            title: 'Success',
            description: response.deletedFromStorage 
              ? 'Image deleted from database and storage'
              : 'Image deleted from database',
          });
        } else {
          throw new Error(response.message || 'Delete failed');
        }
      } catch (error: unknown) {
        toast({
          title: 'Delete failed',
          description: error instanceof Error ? error.message : 'Failed to delete image',
          variant: 'destructive',
        });
      }
    }

    setDeleteConfirmOpen(false);
    setImageToDelete(null);
  };

  const cancelDeleteImage = () => {
    setDeleteConfirmOpen(false);
    setImageToDelete(null);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file">Upload File</TabsTrigger>
          <TabsTrigger value="url">From URL</TabsTrigger>
          <TabsTrigger value="paste">Paste Image</TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <div>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Choose File
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1"
            />
            <Button type="button" onClick={handleUrlUpload}>
              Add URL
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="paste" className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onPaste={handlePasteImage}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Focus the div to enable paste
                (e.target as HTMLElement).focus();
              }
            }}
          >
            <p className="text-gray-500">Click here and paste an image (Ctrl+V)<br />Or paste an image URL</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-2">
          <Label>Images ({images.length})</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-2">
                  <div className="aspect-square relative">
                    <img
                      src={image.url || image.imageData}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-xs text-center mt-1">Position: {image.position}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteImage}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteImage}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}