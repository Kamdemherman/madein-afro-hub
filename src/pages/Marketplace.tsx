import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Loader2, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock_quantity: number;
  categories: {
    name: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (categoriesData) {
      setCategories(categoriesData);
    }

    // Fetch products
    const { data: productsData, error } = await supabase
      .from('products')
      .select('id, name, slug, price, images, stock_quantity, categories(name)')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(productsData || []);
    }
    setLoading(false);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categories?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
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
                {loading ? '...' : `${sortedProducts.length} produits trouvés`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map(product => (
                  <Link key={product.id} to={`/products/${product.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={product.images[0] || '/placeholder.svg'} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.stock_quantity === 0 && (
                          <Badge variant="destructive" className="absolute top-2 right-2">
                            Rupture
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        {product.categories && (
                          <Badge variant="secondary" className="mb-2">
                            {product.categories.name}
                          </Badge>
                        )}
                        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            {product.price.toFixed(2)} €
                          </span>
                          <Button size="icon" variant="outline">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
