
import React from 'react';
import UserCard from './UserCard';
import UserTable from './UserTable';
import { User } from '@/hooks/useUsers';
import { ViewMode } from '@/hooks/users/useUserTypes';

type UserListProps = {
  users: User[];
  viewMode: ViewMode;
  delegationName: (delegationId: string) => string;
  getInitials: (name: string) => string;
  onDetailsClick: (user: User) => void;
  onEditClick: (user: User) => void;
  onDeleteClick: (id: string) => void;
};

const UserList: React.FC<UserListProps> = ({
  users,
  viewMode,
  delegationName,
  getInitials,
  onDetailsClick,
  onEditClick,
  onDeleteClick,
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se encontraron usuarios que coincidan con tu búsqueda.</p>
      </div>
    );
  }

  return (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              delegationName={delegationName(user.delegation_id || '')}
              getInitials={getInitials}
              onDetailsClick={() => onDetailsClick(user)}
              onEditClick={() => onEditClick(user)}
              onDeleteClick={() => onDeleteClick(user.id)}
            />
          ))}
        </div>
      ) : (
        <UserTable
          users={users}
          delegationName={delegationName}
          onDetailsClick={onDetailsClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      )}
    </div>
  );
};

export default UserList;
