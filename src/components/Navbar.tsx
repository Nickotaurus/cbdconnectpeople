
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Award, MapPin, Home, User, Leaf, LogOut, MessageSquare, Network } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Links communs à tous les utilisateurs
  const commonLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/map', label: 'Carte', icon: MapPin },
    { href: '/ranking', label: 'Classement', icon: Award },
    { href: '/guide', label: 'Guide CBD', icon: MessageSquare },
    { href: '/forum', label: 'Forum', icon: MessageSquare },
  ];
  
  // Liens supplémentaires selon le rôle
  const getLinks = () => {
    const links = [...commonLinks];
    
    // Ajout des liens spécifiques au rôle
    if (user) {
      // Lien vers les producteurs (visible par tous mais avec fonctionnalités différentes selon le rôle)
      links.push({ href: '/producers', label: 'Producteurs', icon: Leaf });
      
      // Autres liens spécifiques pourraient être ajoutés ici
    }
    
    return links;
  };
  
  const links = getLinks();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Network className="h-6 w-6 text-primary" />
            <span className="font-bold">CBDConnectWorld</span>
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative rounded-full h-8 w-8 flex items-center justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  {user.role !== "client" && (
                    <Badge
                      variant={user.isVerified ? "default" : "outline"}
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full border"
                    >
                      {user.isVerified ? "✓" : "!"}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role === "client" ? "Client" : 
                     user.role === "store" ? "Boutique" : "Producteur"}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                {user.role === "store" && (
                  <DropdownMenuItem onClick={() => navigate('/store-dashboard')}>
                    <Network className="h-4 w-4 mr-2" />
                    Ma boutique
                  </DropdownMenuItem>
                )}
                {user.role === "producer" && (
                  <DropdownMenuItem onClick={() => navigate('/producer-dashboard')}>
                    <Leaf className="h-4 w-4 mr-2" />
                    Mon exploitation
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Link>
            </Button>
          )}
          
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
                    <Network className="h-6 w-6 text-primary" />
                    <span className="font-bold">CBDConnectWorld</span>
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
                  
                  {/* Boutons de connexion/inscription pour mobile */}
                  {!user && (
                    <div className="mt-4 flex flex-col gap-2">
                      <Button asChild>
                        <Link to="/login" onClick={() => setIsSheetOpen(false)}>
                          Se connecter
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/register" onClick={() => setIsSheetOpen(false)}>
                          S'inscrire
                        </Link>
                      </Button>
                    </div>
                  )}
                  
                  {/* Bouton de déconnexion pour mobile */}
                  {user && (
                    <Button variant="outline" className="mt-4" onClick={() => {
                      handleLogout();
                      setIsSheetOpen(false);
                    }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  )}
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
