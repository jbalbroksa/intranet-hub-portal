
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, UserIcon, Edit, Trash } from 'lucide-react';

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

type UserTableProps = {
  users: User[];
  getDelegationName: (delegationId: number) => string;
  getInitials: (name: string) => string;
  onDetailsClick: (user: User) => void;
  onEditClick: (user: User) => void;
  onDeleteClick: (id: number) => void;
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  getDelegationName,
  getInitials,
  onDetailsClick,
  onEditClick,
  onDeleteClick
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-6">
        No se encontraron usuarios
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead className="hidden md:table-cell">Delegación</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">Rol</TableHead>
          <TableHead className="hidden md:table-cell">Último acceso</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                  <div className="text-sm text-muted-foreground">{user.position}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{getDelegationName(user.delegationId)}</TableCell>
            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <>
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Administrador</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="h-4 w-4" />
                    <span>Usuario</span>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onDetailsClick(user)}>
                  <UserIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditClick(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteClick(user.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
