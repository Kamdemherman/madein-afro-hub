import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            MADE IN AFRICA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link to="/marketplace" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link to="/categories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Catégories
          </Link>
          <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Blog
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            À Propos
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline">
            <User className="h-4 w-4 mr-2" />
            Connexion
          </Button>
          <Button variant="hero">
            Devenir Membre
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-in">
          <nav className="flex flex-col space-y-4 p-4">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link to="/marketplace" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link to="/categories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Catégories
            </Link>
            <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              À Propos
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Button>
              <Button variant="hero" className="w-full">
                Devenir Membre
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
