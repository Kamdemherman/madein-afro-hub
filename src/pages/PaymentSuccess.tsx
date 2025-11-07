import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    if (sessionId) {
      clearCart();
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="pt-12 pb-8">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Paiement réussi !</h1>
              <p className="text-muted-foreground mb-8">
                Votre commande a été confirmée. Vous recevrez un email de confirmation avec les détails de votre commande.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button asChild size="lg">
                  <Link to="/profile">Voir mes commandes</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="/marketplace">Continuer mes achats</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
