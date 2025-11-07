import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Target, Heart, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                À propos de MADE IN AFRICA
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Votre plateforme B2B et B2C pour découvrir et commercialiser des produits africains authentiques
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Notre Mission</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-card shadow-card">
                  <CardContent className="p-6">
                    <Target className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Connecter les marchés</h3>
                    <p className="text-muted-foreground">
                      Nous créons un pont entre les artisans africains et les marchés mondiaux, 
                      facilitant le commerce B2B et B2C pour une croissance durable.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card shadow-card">
                  <CardContent className="p-6">
                    <Heart className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Valoriser l'artisanat</h3>
                    <p className="text-muted-foreground">
                      Chaque produit raconte une histoire. Nous mettons en avant le savoir-faire 
                      traditionnel et l'authenticité des créations africaines.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card shadow-card">
                  <CardContent className="p-6">
                    <Globe className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Commerce équitable</h3>
                    <p className="text-muted-foreground">
                      Nous garantissons des prix justes pour les producteurs et une qualité 
                      exceptionnelle pour les acheteurs, favorisant un commerce éthique.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card shadow-card">
                  <CardContent className="p-6">
                    <ShoppingBag className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Expérience simplifiée</h3>
                    <p className="text-muted-foreground">
                      Notre plateforme moderne offre une expérience d'achat fluide, que vous soyez 
                      grossiste ou détaillant.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Notre Histoire</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  MADE IN AFRICA est née d'une passion pour la richesse culturelle et artisanale du continent africain. 
                  Conscients du potentiel immense des artisans et producteurs locaux, nous avons créé cette plateforme 
                  pour leur offrir une vitrine mondiale.
                </p>
                <p>
                  Notre équipe multiculturelle travaille chaque jour pour faciliter les échanges commerciaux, 
                  garantir la qualité des produits et promouvoir le commerce équitable. Nous croyons fermement 
                  que l'artisanat africain mérite une place de choix sur le marché international.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers de compter des centaines d'artisans partenaires et des milliers 
                  de clients satisfaits à travers le monde. Notre mission continue : faire rayonner l'excellence 
                  africaine à l'échelle mondiale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Nos Valeurs</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-hero flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Authenticité</h3>
                  <p className="text-muted-foreground">
                    Produits 100% authentiques, directement des artisans
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-hero flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Transparence</h3>
                  <p className="text-muted-foreground">
                    Processus clair et communication ouverte
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-hero flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Excellence</h3>
                  <p className="text-muted-foreground">
                    Qualité supérieure garantie sur chaque produit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
