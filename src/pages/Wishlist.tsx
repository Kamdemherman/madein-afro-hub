import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function Wishlist() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = async (productId: string) => {
    await addItem(productId, null, 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Favoris ({items.length})</h1>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Votre liste de favoris est vide</h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits et ajoutez-les à vos favoris
            </p>
            <Button asChild>
              <Link to="/marketplace">Découvrir nos produits</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              if (!item.product) return null;
              const imageUrl = item.product.images?.[0] || '/placeholder.svg';

              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <Link to={`/products/${item.product.slug}`}>
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    </Link>

                    <Link to={`/products/${item.product.slug}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors mb-2">
                        {item.product.name}
                      </h3>
                    </Link>

                    <div className="font-bold text-xl text-primary mb-4">
                      {item.product.price.toFixed(2)} €
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(item.product_id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Ajouter au panier
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(item.product_id)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
