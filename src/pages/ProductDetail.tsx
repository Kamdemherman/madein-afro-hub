import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, Heart, Package, Truck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ProductVariant {
  id: string;
  color: string | null;
  size: string | null;
  stock_quantity: number;
  price_modifier: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  wholesale_price: number | null;
  stock_quantity: number;
  min_order_quantity: number;
  images: string[];
  technical_specs: any;
  category_id: string;
  categories: {
    name: string;
  } | null;
  product_variants: ProductVariant[];
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const { toast } = useToast();
  const { addItem } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name), product_variants(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      navigate('/marketplace');
    } else {
      setProduct(data);
      setQuantity(data.min_order_quantity);
      if (data.product_variants?.length > 0) {
        setSelectedVariant(data.product_variants[0]);
      }
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem(product.id, selectedVariant?.id || null, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const mainImage = product.images[0] || '/placeholder.svg';
  const availableColors = [...new Set(product.product_variants.map(v => v.color).filter(Boolean))];
  const availableSizes = [...new Set(product.product_variants.map(v => v.size).filter(Boolean))];
  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : product.stock_quantity > 0;
  const currentPrice = product.price + (selectedVariant?.price_modifier || 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img 
                  src={mainImage} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      className="aspect-square rounded-md overflow-hidden bg-muted border-2 border-transparent hover:border-primary transition-all"
                      onClick={() => {
                        const newImages = [...product.images];
                        [newImages[0], newImages[idx]] = [newImages[idx], newImages[0]];
                        setProduct({...product, images: newImages});
                      }}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                {product.categories && (
                  <Badge variant="secondary" className="mb-2">
                    {product.categories.name}
                  </Badge>
                )}
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-primary">
                    {currentPrice.toFixed(2)} €
                  </span>
                  {product.wholesale_price && (
                    <span className="text-xl text-muted-foreground">
                      Prix gros: {product.wholesale_price.toFixed(2)} €
                    </span>
                  )}
                </div>
              </div>

              {/* Variant Selection */}
              {(availableColors.length > 0 || availableSizes.length > 0) && (
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {availableColors.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Couleur</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map((color) => {
                            const variant = product.product_variants.find(v => v.color === color);
                            const isSelected = selectedVariant?.color === color;
                            return (
                              <Button
                                key={color}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedVariant(variant || null)}
                              >
                                {color}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {availableSizes.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Taille</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map((size) => {
                            const variant = product.product_variants.find(v => 
                              v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color)
                            );
                            const isSelected = selectedVariant?.size === size;
                            return (
                              <Button
                                key={size}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedVariant(variant || null)}
                              >
                                {size}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {inStock 
                        ? `${selectedVariant?.stock_quantity || product.stock_quantity} unités disponibles`
                        : 'Rupture de stock'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span>Livraison sous 5-7 jours ouvrés</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Quantité minimale: {product.min_order_quantity}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(selectedVariant?.stock_quantity || product.stock_quantity, quantity + 1))}
                    disabled={!inStock}
                  >
                    +
                  </Button>
                </div>
                <Button 
                  className="flex-1" 
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {product.description && (
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {product.technical_specs && Object.keys(product.technical_specs).length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Spécifications techniques</h2>
                  <dl className="grid grid-cols-2 gap-3">
                    {Object.entries(product.technical_specs).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-muted-foreground capitalize">{key}</dt>
                        <dd className="font-medium">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
