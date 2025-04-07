
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string;
  delegationId: string;
  position: string;
  bio: string;
};

type UserDetailProps = {
  user: User | null;
  isOpen: boolean;
  getDelegationName: (delegationId: string) => string;
  getInitials: (name: string) => string;
  onClose: () => void;
  onEdit: () => void;
};

const UserDetail: React.FC<UserDetailProps> = ({
  user,
  isOpen,
  getDelegationName,
  getInitials,
  onClose,
  onEdit
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            
            <h3 className="font-medium text-xl">{user.name}</h3>
            <div className="text-muted-foreground">{user.position}</div>
            
            <div className="flex gap-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                {getDelegationName(user.delegationId)}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
              <p>{user.email}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Delegación</h4>
              <p>{getDelegationName(user.delegationId)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Último acceso</h4>
              <p>{user.lastLogin}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Biografía</h4>
              <p className="text-sm whitespace-pre-line">{user.bio}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={onEdit}>
              Editar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetail;
