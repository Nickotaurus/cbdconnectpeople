
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
}

const NavbarLink = ({ href, label, icon: Icon, isActive, onClick }: NavbarLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary font-bold" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

export default NavbarLink;
