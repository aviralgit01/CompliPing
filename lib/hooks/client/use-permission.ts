// import { useStore } from "@/lib/store";
// import { ROLE_PERMISSIONS } from "@/lib/constants/role-permission";

// export const usePermission = () => {
//   const { user } = useStore((state) => state);
//   const role = user.role;

//   const permissions = ROLE_PERMISSIONS[role] || [];

//   const hasPermission = (permission: string | string[]) => {
//     if (permissions.includes("*")) return true;

//     if (Array.isArray(permission)) {
//       return permission.some((p) => permissions.includes(p));
//     }

//     return permissions.includes(permission);
//   };

//   const hasAllPermissions = (permissionList: string[]) => {
//     if (permissions.includes("*")) return true;

//     return permissionList.every((p) => permissions.includes(p));
//   };

//   return {
//     role,
//     permissions,
//     hasPermission,
//     hasAllPermissions,
//   };
// };

import { useStore } from "@/lib/store";
import { ROLE_PERMISSIONS } from "@/lib/constants/role-permission";
import { Permission } from "@/lib/constants/permission";

type RolePermission = Permission | "*";

export const usePermission = () => {
  const { user } = useStore((state) => state);

  const role = user?.role;

  const permissions: RolePermission[] = ROLE_PERMISSIONS[role] || [];

  const hasPermission = (permission: Permission | Permission[]): boolean => {
    if (permissions.includes("*")) return true;

    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p));
    }

    return permissions.includes(permission);
  };

  const hasAllPermissions = (permissionList: Permission[]): boolean => {
    if (permissions.includes("*")) return true;

    return permissionList.every((p) => permissions.includes(p));
  };

  return {
    role,
    permissions,
    hasPermission,
    hasAllPermissions,
  };
};

// Usage

// const { hasPermission } = usePermission();

// {hasPermission("employee:create") && (
//   <Button>Create Employee</Button>
// )}

// {hasPermission("employee:delete") && (
//   <Button>Delete</Button>
// )}
