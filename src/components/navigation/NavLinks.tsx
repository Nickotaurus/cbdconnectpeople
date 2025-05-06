
import { LucideIcon } from 'lucide-react';
import NavbarLink from './NavbarLink';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavLinksProps {
  links: NavLink[];
  currentPath: string;
}

const NavLinks = ({ links, currentPath }: NavLinksProps) => {
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
    <nav className="hidden md:flex items-center gap-6">
      {links.map((link) => (
        <NavbarLink
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon}
          isActive={isActive(link.href)}
        />
      ))}
    </nav>
  );
};

export default NavLinks;
