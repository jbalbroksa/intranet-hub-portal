import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
};

const NavItem = ({ href, title, icon, isActive, onClick }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200",
        isActive
          ? "bg-red text-white shadow-md transform scale-[1.02]"
          : "text-white/90 hover:bg-darkBlue/70 hover:text-white hover:translate-x-1",
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "mr-3 transition-transform duration-200",
          isActive ? "text-white" : "text-white/80",
        )}
      >
        {icon}
      </span>
      <span>{title}</span>
    </Link>
  );
};

export default NavItem;
