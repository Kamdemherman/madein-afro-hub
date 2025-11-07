import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  product: {
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
  variant?: {
    color: string | null;
    size: string | null;
    price_modifier: number;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (productId: string, variantId: string | null, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        variant_id,
        quantity,
        products:product_id (
          name,
          price,
          images,
          slug
        ),
        product_variants:variant_id (
          color,
          size,
          price_modifier
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
      return;
    }

    setItems(data as any);
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addItem = async (productId: string, variantId: string | null, quantity: number) => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour ajouter au panier',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: user.id,
        product_id: productId,
        variant_id: variantId,
        quantity,
      }, {
        onConflict: 'user_id,product_id,variant_id'
      });

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter au panier',
        variant: 'destructive',
      });
      return;
    }

    await refreshCart();
    toast({
      title: 'Ajouté au panier',
      description: 'Le produit a été ajouté à votre panier',
    });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la quantité',
        variant: 'destructive',
      });
      return;
    }

    await refreshCart();
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article',
        variant: 'destructive',
      });
      return;
    }

    await refreshCart();
    toast({
      title: 'Article supprimé',
      description: 'L\'article a été retiré du panier',
    });
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      return;
    }

    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const basePrice = item.product.price;
    const modifier = item.variant?.price_modifier || 0;
    return sum + (basePrice + modifier) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      total,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
