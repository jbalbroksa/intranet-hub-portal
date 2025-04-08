
import React from 'react';
import { User } from '@/hooks/useUsers';

type FilterProps = {
  searchTerm: string;
  selectedDelegationFilter: string | null;
  advancedFilters: {
    role: string | null;
    delegation_id: string | null;
    lastLoginDays: number | null;
  };
  users: User[];
};

const UserFilterManager: React.FC<FilterProps & { children: (filteredUsers: User[]) => React.ReactNode }> = ({
  users,
  searchTerm,
  selectedDelegationFilter,
  advancedFilters,
  children
}) => {
  // Filter users based on search term
  const filteredBySearch = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.position && user.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Apply main delegation filter
  const filteredByDelegation = filteredBySearch.filter(user => 
    selectedDelegationFilter === null || 
    user.delegation_id === selectedDelegationFilter
  );
  
  // Apply advanced filters
  const filteredUsers = filteredByDelegation.filter(user => {
    // Role filter
    if (advancedFilters.role && user.role !== advancedFilters.role) {
      return false;
    }
    
    // Advanced delegation filter (different from the quick filter)
    if (advancedFilters.delegation_id && user.delegation_id !== advancedFilters.delegation_id) {
      return false;
    }
    
    // Last login days filter
    if (advancedFilters.lastLoginDays !== null) {
      const now = new Date();
      if (advancedFilters.lastLoginDays === -1) {
        // Filter users who never logged in
        return !user.last_login || user.last_login === "Nunca";
      } else {
        // Filter users by last login date
        if (!user.last_login || user.last_login === "Nunca") return false;
        
        const lastLogin = new Date(user.last_login);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - advancedFilters.lastLoginDays);
        return lastLogin >= cutoffDate;
      }
    }
    
    return true;
  });
  
  return <>{children(filteredUsers)}</>;
};

export default UserFilterManager;
