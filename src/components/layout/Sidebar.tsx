import React, { useState } from 'react';
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
  User,
  Moon,
  Sun,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from "@/components/ui/theme-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { cn } from '@/lib/utils';

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
  const { setTheme } = useTheme();
  const { theme } = useTheme();

  // Check if a nav item is active
  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-background h-screen">
        <div className="flex items-center justify-center h-16 border-b">
          <Link to="/" className="text-lg font-semibold">Intranet</Link>
        </div>

        <nav className="flex-1 py-4">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-foreground transition-colors",
                  isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-foreground transition-colors",
                  isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      AU
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Admin Usuario</span>
                </div>
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/perfil">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex items-center justify-between">
                  <span>Modo oscuro</span>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light")
                    }}
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
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
        <SheetContent side="left" className="w-64">
          <SheetHeader className="text-left">
            <SheetTitle>Intranet</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 py-4">
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-foreground transition-colors",
                    isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-foreground transition-colors",
                    isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        AU
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Admin Usuario</span>
                  </div>
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)}>
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center justify-between">
                    <span>Modo oscuro</span>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => {
                        setTheme(checked ? "dark" : "light")
                      }}
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
