
import React, { useState } from 'react';
import { Bell, Search, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count

  return (
    <header className={cn("h-16 bg-white border-b border-border flex items-center px-4 md:px-6", className)}>
      <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center">
          {!searchOpen && (
            <div className="mr-4">
              <img src="/placeholder.svg" alt="Logo" className="h-8" />
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Search bar - expanded on mobile */}
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            searchOpen 
              ? "fixed inset-0 bg-white z-50 flex items-center p-4" 
              : "relative hidden md:block"
          )}>
            {searchOpen && (
              <button 
                onClick={() => setSearchOpen(false)} 
                className="absolute right-4 top-4 p-2"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <div className={cn(
              "relative flex items-center", 
              searchOpen ? "w-full max-w-xl mx-auto" : "w-64"
            )}>
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar..."
                className="h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {!searchOpen && (
            <button 
              onClick={() => setSearchOpen(true)} 
              className="md:hidden p-2 rounded-md hover:bg-muted"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {/* Notifications */}
          {!searchOpen && (
            <div className="relative">
              <button className="p-2 rounded-md hover:bg-muted relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* User profile */}
          {!searchOpen && (
            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
              <div className="relative w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5" />
              </div>
              <span className="hidden md:inline-block text-sm font-medium">
                Administrador
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
