
import React from 'react';
import NavItem from './NavItem';
import { Settings, Users } from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

type SecondaryNavProps = {
  currentPath: string;
  onClick?: (href: string) => void;
};

const SecondaryNav: React.FC<SecondaryNavProps> = ({ currentPath, onClick }) => {
  const secondaryNavItems: NavItem[] = [
    {
      title: "Configuración",
      href: "/configuracion",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Usuarios",
      href: "/usuarios",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="mt-6 pt-6 border-t px-2 space-y-1">
      {secondaryNavItems.map((item) => (
        <NavItem
          key={item.title}
          href={item.href}
          title={item.title}
          icon={item.icon}
          isActive={currentPath === item.href}
          onClick={() => onClick && onClick(item.href)}
        />
      ))}
    </div>
  );
};

export default SecondaryNav;
