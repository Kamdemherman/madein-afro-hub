import { Link } from "react-router-dom";
import { ShoppingBag, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                MADE IN AFRICA
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plateforme de commerce B2B et B2C dédiée aux produits africains authentiques.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link to="/best-sellers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Meilleures ventes
                </Link>
              </li>
            </ul>
          </div>

          {/* Pour les membres */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Pour les membres</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/wholesaler" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Espace Grossiste
                </Link>
              </li>
              <li>
                <Link to="/retailer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Espace Détaillant
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Programme fidélité
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Suivre ma commande
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MADE IN AFRICA SHOPS. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
