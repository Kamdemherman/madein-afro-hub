-- Create product_variants table for colors, sizes, and stock management
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color TEXT,
  size TEXT,
  sku TEXT UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  price_modifier NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, color, size)
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_variants
CREATE POLICY "Anyone can view active product variants"
ON public.product_variants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = product_variants.product_id 
    AND products.is_active = true
  )
);

CREATE POLICY "Sellers can manage their product variants"
ON public.product_variants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = product_variants.product_id 
    AND (products.seller_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  )
);

-- Create cart table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

-- Enable RLS on cart
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart
CREATE POLICY "Users can view their own cart"
ON public.cart_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their cart"
ON public.cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cart"
ON public.cart_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their cart"
ON public.cart_items FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for cart updated_at
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();