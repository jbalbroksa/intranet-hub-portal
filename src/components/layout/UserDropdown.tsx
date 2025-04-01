
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

type UserDropdownProps = {
  onCloseMenu?: () => void;
};

const UserDropdown = ({ onCloseMenu }: UserDropdownProps) => {
  const { theme, setTheme } = useTheme();

  return (
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
          <Link to="/perfil" onClick={onCloseMenu}>
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
  );
};

export default UserDropdown;
