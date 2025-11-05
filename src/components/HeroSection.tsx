import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-marketplace.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30">
            <span className="text-sm font-medium text-secondary-foreground">🌍 Plateforme B2B & B2C Africaine</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Découvrez l'Afrique
            </span>
            <br />
            <span className="text-foreground">
              Authentique
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl">
            La plateforme de référence pour l'achat et la vente de produits africains authentiques. 
            Connectez-vous avec des grossistes et détaillants à travers le continent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="hero" size="lg" className="text-base">
              Explorer le Marché
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Devenir Vendeur
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">2K+</div>
              <div className="text-sm text-muted-foreground">Produits</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-secondary">500+</div>
              <div className="text-sm text-muted-foreground">Vendeurs</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-accent">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
