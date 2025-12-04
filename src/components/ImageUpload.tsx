import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  userId: string;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, userId, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast({
        title: 'Limite atteinte',
        description: `Maximum ${maxImages} images autorisées`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const newUrls: string[] = [];

    try {
      for (const file of filesToUpload) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Type invalide',
            description: `${file.name} n'est pas une image`,
            variant: 'destructive',
          });
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'Fichier trop volumineux',
            description: `${file.name} dépasse 5MB`,
            variant: 'destructive',
          });
          continue;
        }

        const url = await uploadImage(file);
        newUrls.push(url);
      }

      if (newUrls.length > 0) {
        onImagesChange([...images, ...newUrls]);
        toast({
          title: 'Succès',
          description: `${newUrls.length} image(s) téléchargée(s)`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors du téléchargement',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Ajouter</span>
              </>
            )}
          </div>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        {images.length}/{maxImages} images • Max 5MB par image • JPG, PNG, WebP
      </p>
    </div>
  );
}
