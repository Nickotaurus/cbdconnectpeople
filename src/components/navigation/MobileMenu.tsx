
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, LogOut, LucideIcon, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import MobileNavLink from './MobileNavLink';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MobileMenuProps {
  links: NavLink[];
  currentPath: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MobileMenu = ({ links, currentPath, isLoggedIn, onLogout }: MobileMenuProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };
  
  const handleLogout = () => {
    onLogout();
    setIsSheetOpen(false);
  };

  const isActive = (path: string) => {
    // Exact match for root path
    if (path === '/' && currentPath === '/') {
      return true;
    }
    
    // For other paths, check if currentPath starts with the path
    // This allows active state for nested routes
    if (path !== '/' && currentPath.startsWith(path)) {
      return true;
    }
    
    return false;
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="px-2">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center" onClick={handleLinkClick}>
              <img 
                src="/lovable-uploads/553fc45c-9d08-41b8-abd8-7cceb445942c.png" 
                alt="Logo" 
                className="h-40 w-40"
              />
            </Link>
            <Button size="icon" variant="ghost" onClick={() => setIsSheetOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                isActive={isActive(link.href)}
                onClick={handleLinkClick}
              />
            ))}
            
            {!isLoggedIn && (
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild>
                  <Link to="/register" onClick={handleLinkClick}>
                    Référencer ma boutique
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={handleLinkClick}>
                    Se connecter
                  </Link>
                </Button>
              </div>
            )}
            
            {isLoggedIn && (
              <Button variant="outline" className="mt-4" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
