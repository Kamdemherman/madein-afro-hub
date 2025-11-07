import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, User, Menu, LogOut, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();

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
          <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Blog
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            À Propos
          </Link>
          <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Mon Compte
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth">
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/auth">Devenir Membre</Link>
              </Button>
            </>
          )}
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
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Accueil
            </Link>
            <Link to="/marketplace" className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Marketplace
            </Link>
            <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
            <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              À Propos
            </Link>
            <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/cart" className="relative inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Panier
              {itemCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {itemCount}
                </Badge>
              )}
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              {user ? (
                <>
                  <Button variant="outline" className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/auth">
                      <User className="h-4 w-4 mr-2" />
                      Connexion
                    </Link>
                  </Button>
                  <Button variant="hero" className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/auth">Devenir Membre</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
