
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

// Type mapping to convert between User types
type UserCardType = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string;
  delegationId: string;
  position: string;
  bio: string;
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

  // Convert User to UserCardType
  const mapUserToCardType = (user: User): UserCardType => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    lastLogin: user.last_login || 'Nunca',
    delegationId: user.delegation_id || '',
    position: user.position || '',
    bio: user.bio || '',
  });

  return (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => {
            const cardUser = mapUserToCardType(user);
            return (
              <UserCard
                key={user.id}
                user={cardUser}
                delegationName={delegationName(user.delegation_id || '')}
                getInitials={getInitials}
                onDetailsClick={() => onDetailsClick(user)}
                onEditClick={() => onEditClick(user)}
                onDeleteClick={() => onDeleteClick(user.id)}
              />
            );
          })}
        </div>
      ) : (
        <UserTable
          users={users.map(mapUserToCardType)}
          delegationName={delegationName}
          getInitials={getInitials}
          onDetailsClick={onDetailsClick}
          onEditClick={onEditClick}
          onDeleteClick={(user) => onDeleteClick(user.id)}
        />
      )}
    </div>
  );
};

export default UserList;
