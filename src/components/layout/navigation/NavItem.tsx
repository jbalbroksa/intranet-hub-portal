
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type NavItemProps = {
  href: string;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
};

const NavItem = ({ href, title, icon, isActive, onClick }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-foreground transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{title}</span>
    </Link>
  );
};

export default NavItem;
