import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshWishlist = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        product_id,
        product:product_id (
          name,
          price,
          images,
          slug
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
      return;
    }

    setItems(data as any);
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour ajouter aux favoris',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter aux favoris',
        variant: 'destructive',
      });
      return;
    }

    await refreshWishlist();
    toast({
      title: 'Ajouté aux favoris',
      description: 'Le produit a été ajouté à vos favoris',
    });
  };

  const removeFromWishlist = async (productId: string) => {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user?.id)
      .eq('product_id', productId);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de retirer des favoris',
        variant: 'destructive',
      });
      return;
    }

    await refreshWishlist();
    toast({
      title: 'Retiré des favoris',
      description: 'Le produit a été retiré de vos favoris',
    });
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      items,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
