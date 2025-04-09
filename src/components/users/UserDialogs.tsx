import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserForm from "@/components/users/UserForm";
import UserDetail from "@/components/users/UserDetail";
import { User } from "@/hooks/useUsers";
import { FormMode } from "@/hooks/users/useUserTypes";

type Delegation = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

type UserDialogsProps = {
  dialogOpen: boolean;
  detailsDialogOpen: boolean;
  formMode: FormMode;
  currentUser: User | null;
  formData: {
    name: string;
    email: string;
    role: "admin" | "user";
    position: string;
    delegation_id: string;
    bio: string;
  };
  delegations: Delegation[];
  getDelegationName: (delegationId: string) => string;
  getInitials: (name: string) => string;
  onSetDialogOpen: (open: boolean) => void;
  onSetDetailsDialogOpen: (open: boolean) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onRoleChange: (value: string) => void;
  onDelegationChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onEdit: () => void;
};

const UserDialogs: React.FC<UserDialogsProps> = ({
  dialogOpen,
  detailsDialogOpen,
  formMode,
  currentUser,
  formData,
  delegations,
  getDelegationName,
  getInitials,
  onSetDialogOpen,
  onSetDetailsDialogOpen,
  onInputChange,
  onRoleChange,
  onDelegationChange,
  onSubmit,
  onEdit,
}) => {
  return (
    <>
      {/* Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={onSetDialogOpen}>
        <DialogContent
          className="sm:max-w-[600px]"
          aria-describedby="user-form-description"
        >
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? "Crear nuevo usuario" : "Editar usuario"}
            </DialogTitle>
            <DialogDescription id="user-form-description">
              Complete todos los campos para{" "}
              {formMode === "create" ? "crear un nuevo" : "actualizar el"}{" "}
              usuario.
            </DialogDescription>
          </DialogHeader>

          <UserForm
            formData={{
              name: formData.name,
              email: formData.email,
              role: formData.role,
              position: formData.position || "",
              delegationId: formData.delegation_id || "",
              bio: formData.bio || "",
            }}
            delegations={delegations}
            formMode={formMode === "view" ? "edit" : formMode}
            onSubmit={onSubmit}
            onCancel={() => onSetDialogOpen(false)}
            onInputChange={onInputChange}
            onRoleChange={onRoleChange}
            onDelegationChange={onDelegationChange}
          />
        </DialogContent>
      </Dialog>

      {/* User details dialog */}
      <UserDetail
        user={
          currentUser
            ? {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                lastLogin: currentUser.last_login || "Nunca",
                delegationId: currentUser.delegation_id || "",
                position: currentUser.position || "",
                bio: currentUser.bio || "",
              }
            : null
        }
        isOpen={detailsDialogOpen}
        getDelegationName={getDelegationName}
        getInitials={getInitials}
        onClose={() => onSetDetailsDialogOpen(false)}
        onEdit={onEdit}
      />
    </>
  );
};

export default UserDialogs;
