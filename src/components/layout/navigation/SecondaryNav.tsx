import React from "react";
import NavItem from "./NavItem";
import { Settings, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

type SecondaryNavProps = {
  currentPath: string;
  onClick?: (href: string) => void;
};

const SecondaryNav: React.FC<SecondaryNavProps> = ({
  currentPath,
  onClick,
}) => {
  const { isAdmin } = useAuth();

  const secondaryNavItems: NavItem[] = [
    {
      title: "Configuración",
      href: "/configuracion",
      icon: <Settings className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      title: "Usuarios",
      href: "/usuarios",
      icon: <Users className="h-5 w-5" />,
      adminOnly: true,
    },
  ];

  // Filter items based on user role
  const filteredItems = secondaryNavItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin),
  );

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t px-2 space-y-1">
      {filteredItems.map((item) => (
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
