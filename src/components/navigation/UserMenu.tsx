
import { useNavigate } from 'react-router-dom';
import { User, Network, Briefcase, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserMenuProps {
  user: {
    name: string;
    role: string;
    isVerified?: boolean;
  };
  onLogout: () => void;
}

const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
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
             user.role === "store" ? "Boutique" : "Partenaire"}
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
        {user.role === "partner" && (
          <DropdownMenuItem onClick={() => navigate('/partner/profile')}>
            <Briefcase className="h-4 w-4 mr-2" />
            Mon espace partenaire
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
