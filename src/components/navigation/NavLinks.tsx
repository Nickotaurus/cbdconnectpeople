
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
  const isActive = (path: string) => currentPath === path;
  
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
