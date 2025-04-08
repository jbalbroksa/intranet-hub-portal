import { useState } from 'react';
import { User } from '@/hooks/useUsers';
import { FormMode } from '@/hooks/users/useUserTypes';

type UserFormData = Omit<User, 'id' | 'created_at'>;

export const useUserDialogs = () => {
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    position: '',
    delegation_id: '',
    bio: '',
    last_login: new Date().toISOString(),
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      position: '',
      delegation_id: '',
      bio: '',
      last_login: new Date().toISOString(),
    });
  };

  // Open dialog for creating a new user
  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing an existing user
  const openEditDialog = (user: User) => {
    setFormMode('edit');
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      position: user.position || '',
      delegation_id: user.delegation_id || '',
      bio: user.bio || '',
      last_login: user.last_login || new Date().toISOString(),
    });
    setDialogOpen(true);
  };

  // Open dialog for viewing user details
  const openDetailsDialog = (user: User) => {
    setCurrentUser(user);
    setDetailsDialogOpen(true);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle delegation change
  const handleDelegationChange = (value: string) => {
    setFormData({
      ...formData,
      delegation_id: value === "0" ? "" : value,
    });
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as 'admin' | 'user',
    });
  };

  return {
    dialogOpen,
    setDialogOpen,
    detailsDialogOpen,
    setDetailsDialogOpen,
    formMode,
    currentUser,
    setCurrentUser,
    formData,
    resetForm,
    openCreateDialog,
    openEditDialog,
    openDetailsDialog,
    handleInputChange,
    handleDelegationChange,
    handleRoleChange
  };
};
