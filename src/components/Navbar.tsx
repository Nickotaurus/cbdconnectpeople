
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Info, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Close menu when location changes
    closeMenu();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
      isActive 
        ? 'bg-primary/10 text-primary font-medium' 
        : 'hover:bg-secondary'
    }`;
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-md shadow-sm' 
        : 'bg-background'
    }`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-primary">CBD</span>
          <span>Boutique Finder</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navLinkClass} end>
            <Home size={18} />
            <span>Accueil</span>
          </NavLink>
          <NavLink to="/map" className={navLinkClass}>
            <MapPin size={18} />
            <span>Carte</span>
          </NavLink>
          <NavLink to="/guide" className={navLinkClass}>
            <Info size={18} />
            <span>Guide CBD</span>
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMenu}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transform transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'max-h-screen opacity-100 visible' 
          : 'max-h-0 opacity-0 invisible'
      }`}>
        <nav className="flex flex-col gap-2 p-4 bg-background/95 backdrop-blur-sm">
          <NavLink to="/" className={navLinkClass} end onClick={closeMenu}>
            <Home size={18} />
            <span>Accueil</span>
          </NavLink>
          <NavLink to="/map" className={navLinkClass} onClick={closeMenu}>
            <MapPin size={18} />
            <span>Carte</span>
          </NavLink>
          <NavLink to="/guide" className={navLinkClass} onClick={closeMenu}>
            <Info size={18} />
            <span>Guide CBD</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
