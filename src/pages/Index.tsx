import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[] | null;
  stock_quantity: number;
  categories: { name: string } | null;
};


const Index = () => {
  const [featured, setFeatured] = useState<HomeProduct[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id,name,slug,price,images,stock_quantity,categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);
      if (!error && data) setFeatured(data as HomeProduct[]);
      setLoadingFeatured(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <FeaturedCategories />

        {/* Featured Products */}
        <section className="py-16">
          <div className="container px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Produits Vedettes
                </h2>
                <p className="text-muted-foreground">
                  Découvrez notre sélection de produits les plus populaires
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/marketplace">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loadingFeatured ? (
              <div className="text-center text-muted-foreground">Chargement...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    image={(product.images?.[0]) || '/placeholder.svg'}
                    category={product.categories?.name || 'Divers'}
                    inStock={product.stock_quantity > 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Rejoignez Notre Communauté de Membres
              </h2>
              <p className="text-lg text-primary-foreground/90">
                Accédez à des tarifs préférentiels, gérez votre stock en temps réel, 
                et profitez d'un suivi personnalisé de vos commandes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/dashboard/wholesale">
                    Espace Grossiste
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <Link to="/dashboard/retail">
                    Espace Détaillant
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
