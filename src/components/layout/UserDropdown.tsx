
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';

type UserDropdownProps = {
  onCloseMenu?: () => void;
};

const UserDropdown = ({ onCloseMenu }: UserDropdownProps) => {
  const { theme, setTheme } = useTheme();
  const { userDetails, signOut, isAdmin } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {userDetails ? getInitials(userDetails.name) : 'AU'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userDetails ? userDetails.name : 'Usuario'}</span>
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
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/usuarios" onClick={onCloseMenu}>
              Gestionar Usuarios
            </Link>
          </DropdownMenuItem>
        )}
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
        <DropdownMenuItem onClick={signOut}>
          <div className="flex items-center text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
