
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
}

const MobileNavLink = ({ href, label, icon: Icon, isActive, onClick }: MobileNavLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-secondary text-muted-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
};

export default MobileNavLink;
