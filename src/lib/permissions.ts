import type { PermissionModule, PermissionAction, Permissions, UserRole } from "@/types";

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  role: UserRole,
  permissions: Permissions | null | undefined,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  // Super admin has all permissions
  if (role === "super_admin") return true;

  // Check explicit permissions
  if (!permissions) return false;
  return permissions[module]?.[action] === true;
}

/**
 * Check if a user can access a specific page based on path
 */
export function canAccessPage(
  role: UserRole,
  permissions: Permissions | null | undefined,
  pathname: string
): boolean {
  if (role === "super_admin") return true;

  const pathToModule: Record<string, PermissionModule> = {
    "/admin/applications": "applications",
    "/admin/doctors": "doctors",
    "/admin/users": "users",
    "/admin/certificates": "certificates",
    "/admin/payments": "payments",
    "/admin/transactions": "transactions",
    "/admin/coupons": "coupons",
    "/admin/whatsapp-chat": "whatsapp",
    "/admin/support-dashboard": "support",
    "/admin/notifications": "notifications",
    "/admin/payment-fix": "payments",
    "/admin/settings": "settings",
  };

  // Check if the path matches any protected module
  const matchingPath = Object.keys(pathToModule).find((path) =>
    pathname.startsWith(path)
  );

  if (!matchingPath) return true; // Dashboard and unknown paths are accessible
  const permModule = pathToModule[matchingPath];
  return hasPermission(role, permissions, permModule, "read");
}

/**
 * Get all allowed modules for a user
 */
export function getAllowedModules(
  role: UserRole,
  permissions: Permissions | null | undefined
): PermissionModule[] {
  const allModules: PermissionModule[] = [
    "applications",
    "doctors",
    "users",
    "certificates",
    "payments",
    "coupons",
    "whatsapp",
    "support",
    "transactions",
    "notifications",
    "settings",
  ];

  if (role === "super_admin") return allModules;
  if (!permissions) return [];

  return allModules.filter(
    (module) => permissions[module]?.read === true
  );
}

/**
 * Default permissions for different roles
 */
export const defaultPermissions: Record<string, Permissions> = {
  admin: {
    applications: { read: true, write: true, delete: false },
    doctors: { read: true, write: true, delete: false },
    users: { read: true, write: true, delete: false },
    certificates: { read: true, write: true, delete: false },
    payments: { read: true, write: false, delete: false },
    coupons: { read: true, write: true, delete: true },
    whatsapp: { read: true, write: true, delete: false },
    support: { read: true, write: true, delete: false },
    transactions: { read: true, write: false, delete: false },
    notifications: { read: true, write: true, delete: false },
    settings: { read: false, write: false, delete: false },
  },
  support: {
    applications: { read: true, write: false, delete: false },
    doctors: { read: false, write: false, delete: false },
    users: { read: true, write: false, delete: false },
    certificates: { read: true, write: false, delete: false },
    payments: { read: true, write: false, delete: false },
    coupons: { read: false, write: false, delete: false },
    whatsapp: { read: true, write: true, delete: false },
    support: { read: true, write: true, delete: false },
    transactions: { read: false, write: false, delete: false },
    notifications: { read: true, write: false, delete: false },
    settings: { read: false, write: false, delete: false },
  },
};
