
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UserCard from '@/components/users/UserCard';
import UserTable from '@/components/users/UserTable';
import EmptyNotifications from '@/components/notifications/EmptyNotifications';
import { User } from '@/hooks/useUsers';

type UserListProps = {
  users: User[];
  viewMode: 'grid' | 'list';
  delegationName: (id: string) => string;
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
  onDeleteClick
}) => {
  if (users.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyNotifications />
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              lastLogin: user.last_login || 'Nunca',
              delegationId: user.delegation_id || '',
              position: user.position || '',
              bio: user.bio || '',
            }}
            delegationName={delegationName(user.delegation_id || '')}
            getInitials={getInitials}
            onDetailsClick={() => onDetailsClick(user)}
            onEditClick={() => onEditClick(user)}
            onDeleteClick={() => onDeleteClick(user.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <UserTable
          users={users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.last_login || 'Nunca',
            delegationId: user.delegation_id || '',
            position: user.position || '',
            bio: user.bio || '',
          }))}
          getDelegationName={delegationName}
          getInitials={getInitials}
          onDetailsClick={user => onDetailsClick({ 
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            position: user.position,
            delegation_id: user.delegationId,
            bio: user.bio,
            last_login: user.lastLogin
          })}
          onEditClick={user => onEditClick({ 
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            position: user.position,
            delegation_id: user.delegationId,
            bio: user.bio,
            last_login: user.lastLogin
          })}
          onDeleteClick={user => onDeleteClick(user.id)}
        />
      </CardContent>
    </Card>
  );
};

export default UserList;
