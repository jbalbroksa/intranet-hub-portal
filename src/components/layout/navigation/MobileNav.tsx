
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import MainNav from './MainNav';
import SecondaryNav from './SecondaryNav';
import UserDropdown from '../UserDropdown';

type MobileNavProps = {
  currentPath: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (href: string) => void;
  onCloseMenu: () => void;
};

const MobileNav: React.FC<MobileNavProps> = ({ 
  currentPath, 
  isOpen, 
  onOpenChange, 
  onNavigate,
  onCloseMenu 
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
          <SheetTitle className="text-lg text-primary">Intranet</SheetTitle>
        </SheetHeader>

        <nav className="py-4 overflow-y-auto h-[calc(100vh-8rem)]">
          <MainNav currentPath={currentPath} onClick={onNavigate} />
          <SecondaryNav currentPath={currentPath} onClick={onNavigate} />
        </nav>

        <div className="border-t p-4">
          <UserDropdown onCloseMenu={onCloseMenu} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
