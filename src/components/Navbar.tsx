
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Award, MapPin, Home, Compass, BookOpen, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const links = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/map', label: 'Carte', icon: MapPin },
    { href: '/ranking', label: 'Classement', icon: Award },
    { href: '/guide', label: 'Guide CBD', icon: BookOpen },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="font-bold">CBD Boutique Finder</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">
              <User className="h-4 w-4 mr-2" />
              Connexion
            </Link>
          </Button>
          
          {/* Mobile Navigation */}
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
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setIsSheetOpen(false)}>
                    <Compass className="h-6 w-6 text-primary" />
                    <span className="font-bold">CBD Boutique Finder</span>
                  </Link>
                  <Button size="icon" variant="ghost" onClick={() => setIsSheetOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md transition-colors",
                          isActive(link.href) 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-secondary text-muted-foreground"
                        )}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
