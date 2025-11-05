import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  inStock?: boolean;
}

const ProductCard = ({ name, price, image, category, isNew, inStock = true }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 bg-gradient-card">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {isNew && (
            <Badge variant="secondary" className="shadow-lg">
              Nouveau
            </Badge>
          )}
          {!inStock && (
            <Badge variant="destructive" className="shadow-lg">
              Rupture
            </Badge>
          )}
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 left-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
          />
        </button>
      </div>
      
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2 text-xs">
          {category}
        </Badge>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {price.toFixed(2)} €
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {(price * 1.2).toFixed(2)} €
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          variant="default"
          disabled={!inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {inStock ? 'Ajouter au panier' : 'Indisponible'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
