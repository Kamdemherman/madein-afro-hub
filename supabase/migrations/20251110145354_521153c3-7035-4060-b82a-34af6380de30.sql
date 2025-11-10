-- Create wishlist_items table
CREATE TABLE public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlist_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist"
  ON public.wishlist_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist"
  ON public.wishlist_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_wishlist_user_id ON public.wishlist_items(user_id);
CREATE INDEX idx_wishlist_product_id ON public.wishlist_items(product_id);