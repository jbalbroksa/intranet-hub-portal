
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  Package, 
  FileText, 
  FolderOpen, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  isCollapsed: boolean;
  isActive: boolean;
};

const SidebarItem = ({ icon: Icon, label, to, isCollapsed, isActive }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 ease-in-out",
        isActive 
          ? "bg-sidebar-primary text-sidebar-primary-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className={cn("transition-all duration-300", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
        {label}
      </span>
    </Link>
  );
};

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Responsive behavior - collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Building, label: 'Delegaciones', path: '/delegaciones' },
    { icon: Briefcase, label: 'Compañías', path: '/companias' },
    { icon: Package, label: 'Productos', path: '/productos' },
    { icon: FileText, label: 'Noticias', path: '/noticias' },
    { icon: FolderOpen, label: 'Documentos', path: '/documentos' },
    { icon: Settings, label: 'Configuración', path: '/configuracion' },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-sidebar-border relative",
        isCollapsed ? "w-[70px]" : "w-[250px]",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "")}>
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
            I
          </div>
          {!isCollapsed && (
            <h1 className="text-sidebar-foreground font-poppins text-lg ml-2">Intranet</h1>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                to={item.path}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.path}
              />
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-primary text-white p-1 rounded-full shadow-md hover:bg-primary/90 transition-colors z-10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};

export default Sidebar;
