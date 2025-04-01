
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserIcon, Edit, Trash } from 'lucide-react';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string;
  delegationId: number;
  position: string;
  bio: string;
};

type UserCardProps = {
  user: User;
  delegationName: string;
  getInitials: (name: string) => string;
  onDetailsClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

const UserCard: React.FC<UserCardProps> = ({
  user,
  delegationName,
  getInitials,
  onDetailsClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        
        <h3 className="font-poppins font-medium text-lg">{user.name}</h3>
        
        <div className="text-sm text-muted-foreground mt-1">{user.position}</div>
        
        <div className="mt-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted ml-2">
            {delegationName}
          </span>
        </div>
        
        <div className="space-y-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={onDetailsClick}
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Ver detalles
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={onEditClick}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={onDeleteClick}
          >
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
