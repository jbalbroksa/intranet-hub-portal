
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Get page title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Inicio';
    if (path === '/delegaciones') return 'Delegaciones';
    if (path === '/companias') return 'Compañías';
    if (path === '/productos') return 'Productos';
    if (path === '/noticias') return 'Noticias';
    if (path === '/documentos') return 'Documentos';
    if (path === '/notificaciones') return 'Notificaciones';
    if (path === '/configuracion') return 'Configuración';
    if (path === '/usuarios') return 'Usuarios';
    if (path === '/perfil') return 'Mi Perfil';
    
    // Default
    return 'Intranet';
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-poppins font-semibold">{getPageTitle()}</h1>
            </div>
            
            <div className={cn("animate-fadeIn")}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
