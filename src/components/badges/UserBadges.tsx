
import { User } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, UserPlus, Handshake } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserBadgesProps {
  user: User;
  className?: string;
}

export const badges = [
  {
    id: "explorer",
    name: "Explorateur du CBD",
    description: "S'inscrire sur l'application",
    icon: "Trophy",
  },
  {
    id: "tester",
    name: "Testeur",
    description: "Laisser un avis sur une boutique",
    icon: "Star",
  },
  {
    id: "ambassador",
    name: "Ambassadeur",
    description: "Inviter un ami à s'inscrire",
    icon: "UserPlus",
  },
  {
    id: "pro_connect",
    name: "Pro Connect",
    description: "Faire une première mise en relation avec un partenaire",
    icon: "Handshake",
  }
];

const getBadgeIcon = (iconName: string) => {
  switch (iconName) {
    case "Trophy":
      return <Trophy className="h-4 w-4" />;
    case "Star":
      return <Star className="h-4 w-4" />;
    case "UserPlus":
      return <UserPlus className="h-4 w-4" />;
    case "Handshake":
      return <Handshake className="h-4 w-4" />;
    default:
      return <Trophy className="h-4 w-4" />;
  }
};

const UserBadges = ({ user, className = "" }: UserBadgesProps) => {
  // Si l'utilisateur n'a pas de badges, lui attribuer automatiquement le badge "Explorateur du CBD"
  const userBadges = user.badges || [{
    id: "explorer",
    name: "Explorateur du CBD",
    description: "S'inscrire sur l'application",
    icon: "Trophy",
    earnedAt: new Date().toISOString()
  }];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <TooltipProvider>
        {userBadges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <div>
                <Badge variant="outline" className="px-3 py-1 border-primary/30 bg-primary/5 hover:bg-primary/10 flex items-center gap-1.5 cursor-help">
                  {getBadgeIcon(badge.icon)}
                  <span>{badge.name}</span>
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{badge.description}</p>
              {badge.earnedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Obtenu le {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default UserBadges;
