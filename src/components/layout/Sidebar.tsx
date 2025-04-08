
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MainNav from './navigation/MainNav';
import SecondaryNav from './navigation/SecondaryNav';
import UserDropdown from './UserDropdown';
import MobileNav from './navigation/MobileNav';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle navigation item click
  const handleNavItemClick = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-slate-900 h-screen sticky top-0">
        <div className="flex items-center justify-center h-16 border-b border-slate-800">
          <Link to="/" className="text-lg font-semibold text-white">Intranet</Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <MainNav currentPath={location.pathname} />
          <SecondaryNav currentPath={location.pathname} />
        </nav>

        <div className="border-t border-slate-800 p-4">
          <UserDropdown />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <MobileNav 
          currentPath={location.pathname}
          isOpen={isMobileMenuOpen}
          onOpenChange={setIsMobileMenuOpen}
          onNavigate={handleNavItemClick}
          onCloseMenu={() => setIsMobileMenuOpen(false)}
        />
      </div>
    </>
  );
};

export default Sidebar;
