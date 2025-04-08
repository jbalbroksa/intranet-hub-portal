
import React from 'react';
import NavItem from './NavItem';
import { 
  Home, 
  MapPin, 
  Building, 
  Package, 
  Newspaper, 
  FileText, 
  Bell, 
  Calendar
} from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

type MainNavProps = {
  currentPath: string;
  onClick?: (href: string) => void;
};

const MainNav: React.FC<MainNavProps> = ({ currentPath, onClick }) => {
  const mainNavItems: NavItem[] = [
    {
      title: "Inicio",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Delegaciones",
      href: "/delegaciones",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: "Compañías",
      href: "/companias",
      icon: <Building className="h-5 w-5" />,
    },
    {
      title: "Productos",
      href: "/productos",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Noticias",
      href: "/noticias",
      icon: <Newspaper className="h-5 w-5" />,
    },
    {
      title: "Documentos",
      href: "/documentos",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Notificaciones",
      href: "/notificaciones",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Calendario",
      href: "/calendario",
      icon: <Calendar className="h-5 w-5" />,
    },
  ];

  return (
    <div className="px-2 space-y-1">
      {mainNavItems.map((item) => (
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

export default MainNav;
