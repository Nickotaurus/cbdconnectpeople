
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Award, MapPin, Globe, Newspaper, MessageCircle, Briefcase, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth';
import NavLinks from './navigation/NavLinks';
import UserMenu from './navigation/UserMenu';
import MobileMenu from './navigation/MobileMenu';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navLinks = [
    { href: '/home', label: 'Accueil', icon: Home },
    { href: '/map', label: 'Boutiques CBD', icon: MapPin },
    { href: '/news', label: 'Actualité CBD', icon: Newspaper },
    { href: '/partners', label: 'Partenaires CBD', icon: Briefcase },
    { href: '/classifieds', label: 'Petites Annonces', icon: MessageCircle },
    { href: '/ranking', label: 'Classement CBD', icon: Award },
  ];
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            aria-label="Retour à la page d'accueil"
          >
            <img 
              src="/lovable-uploads/553fc45c-9d08-41b8-abd8-7cceb445942c.png" 
              alt="Logo" 
              className="h-16 w-16"
            />
          </Link>
        </div>
        
        <NavLinks links={navLinks} currentPath={location.pathname} />
        
        <div className="flex items-center gap-2">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/register">
                  Référencer ma boutique
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="hidden md:flex">
                <Link to="/login">
                  Se connecter
                </Link>
              </Button>
            </div>
          )}
          
          <MobileMenu 
            links={navLinks} 
            currentPath={location.pathname} 
            isLoggedIn={!!user} 
            onLogout={handleLogout} 
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
