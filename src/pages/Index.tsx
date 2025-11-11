import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import textileImage from "@/assets/product-textile.jpg";
import potteryImage from "@/assets/product-pottery.jpg";
import basketsImage from "@/assets/product-baskets.jpg";

const featuredProducts = [
  {
    id: "1",
    name: "Tissus Africains Traditionnels - Collection Wax",
    price: 45.99,
    image: textileImage,
    category: "Textiles",
    isNew: true,
    inStock: true,
  },
  {
    id: "2",
    name: "Poterie Artisanale Terre Cuite - Ensemble de 5",
    price: 89.99,
    image: potteryImage,
    category: "Artisanat",
    isNew: false,
    inStock: true,
  },
  {
    id: "3",
    name: "Paniers Tressés à la Main - Set Décoratif",
    price: 65.50,
    image: basketsImage,
    category: "Décoration",
    isNew: true,
    inStock: true,
  },
  {
    id: "4",
    name: "Collection Textile Premium - Motifs Géométriques",
    price: 52.00,
    image: textileImage,
    category: "Textiles",
    isNew: false,
    inStock: true,
  },
];

const Index = () => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
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
