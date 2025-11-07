import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { items },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la session de paiement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mon Panier ({itemCount})</h1>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Button asChild>
              <Link to="/marketplace">Continuer mes achats</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const imageUrl = item.product.images?.[0] || '/placeholder.svg';
                const price = item.product.price + (item.variant?.price_modifier || 0);

                return (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.product.slug}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>

                          {item.variant && (
                            <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                              {item.variant.color && <span>Couleur: {item.variant.color}</span>}
                              {item.variant.size && <span>Taille: {item.variant.size}</span>}
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg text-primary">
                            {(price * item.quantity).toFixed(2)} €
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {price.toFixed(2)} € / unité
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Résumé de la commande</h2>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-medium">{total.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="font-medium">Calculé à l'étape suivante</span>
                    </div>
                  </div>

                  <div className="flex justify-between border-t pt-4 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)} €</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? 'Chargement...' : 'Procéder au paiement'}
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/marketplace">Continuer mes achats</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
