import { Card, CardContent } from "@/components/ui/card";
import { Palette, ShoppingBag, Sparkles, Package } from "lucide-react";

const categories = [
  {
    name: "Textiles & Tissus",
    icon: Palette,
    count: "450+ produits",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Artisanat",
    icon: Sparkles,
    count: "320+ produits",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    name: "Poterie & Céramique",
    icon: Package,
    count: "280+ produits",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    name: "Accessoires",
    icon: ShoppingBag,
    count: "550+ produits",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Catégories Populaires
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explorez notre sélection de produits authentiques africains dans différentes catégories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.name}
                className="group cursor-pointer hover:shadow-elegant transition-all duration-300 bg-gradient-card hover:-translate-y-2"
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className={`${category.bgColor} p-4 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
