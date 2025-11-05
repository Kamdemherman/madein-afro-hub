import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

import textileImage from "@/assets/product-textile.jpg";
import potteryImage from "@/assets/product-pottery.jpg";
import basketsImage from "@/assets/product-baskets.jpg";

const products = [
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
  {
    id: "5",
    name: "Vases en Céramique Peints à la Main",
    price: 75.00,
    image: potteryImage,
    category: "Artisanat",
    isNew: true,
    inStock: true,
  },
  {
    id: "6",
    name: "Paniers de Rangement Traditionnels",
    price: 42.50,
    image: basketsImage,
    category: "Décoration",
    isNew: false,
    inStock: false,
  },
  {
    id: "7",
    name: "Tissus Wax Haute Qualité - Rouleau 6m",
    price: 95.00,
    image: textileImage,
    category: "Textiles",
    isNew: true,
    inStock: true,
  },
  {
    id: "8",
    name: "Service de Table en Poterie Africaine",
    price: 120.00,
    image: potteryImage,
    category: "Artisanat",
    isNew: false,
    inStock: true,
  },
];

const Marketplace = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Page Header */}
        <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Marketplace
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explorez notre collection complète de produits africains authentiques
            </p>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-6 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-40">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher des produits..." 
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="artisanat">Artisanat</SelectItem>
                  <SelectItem value="decoration">Décoration</SelectItem>
                  <SelectItem value="accessoires">Accessoires</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select defaultValue="popular">
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Plus populaires</SelectItem>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Button */}
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container px-4">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                {products.length} produits trouvés
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Charger plus de produits
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
