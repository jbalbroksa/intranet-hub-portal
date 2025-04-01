
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Building, 
  Package, 
  Newspaper, 
  FileText, 
  Bell, 
  Settings, 
  Users, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SidebarNavItem from './SidebarNavItem';
import UserDropdown from './UserDropdown';

// Main navigation items
const mainNavItems = [
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
    icon: <CalendarIcon className="h-5 w-5" />,
  },
];

// Secondary navigation items
const secondaryNavItems = [
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

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if a nav item is active
  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
        <div className="flex items-center justify-center h-16 border-b">
          <Link to="/" className="text-lg font-semibold">Intranet</Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-2 space-y-1">
            {mainNavItems.map((item) => (
              <SidebarNavItem
                key={item.title}
                href={item.href}
                title={item.title}
                icon={item.icon}
                isActive={isActive(item.href)}
              />
            ))}
          </div>

          <div className="mt-6 pt-6 border-t px-2 space-y-1">
            {secondaryNavItems.map((item) => (
              <SidebarNavItem
                key={item.title}
                href={item.href}
                title={item.title}
                icon={item.icon}
                isActive={isActive(item.href)}
              />
            ))}
          </div>
        </nav>

        <div className="border-t p-4">
          <UserDropdown />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="h-16 border-b flex items-center justify-center">
              <SheetTitle className="text-lg">Intranet</SheetTitle>
            </SheetHeader>

            <nav className="py-4 overflow-y-auto h-[calc(100vh-8rem)]">
              <div className="px-2 space-y-1">
                {mainNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    href={item.href}
                    title={item.title}
                    icon={item.icon}
                    isActive={isActive(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>

              <div className="mt-6 pt-6 border-t px-2 space-y-1">
                {secondaryNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    href={item.href}
                    title={item.title}
                    icon={item.icon}
                    isActive={isActive(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
            </nav>

            <div className="border-t p-4">
              <UserDropdown onCloseMenu={() => setIsMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
