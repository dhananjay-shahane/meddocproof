"use client";

import { useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { hasPermission, canAccessPage, getAllowedModules } from "@/lib/permissions";
import type { PermissionModule, PermissionAction, Permissions, UserRole } from "@/types";

export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = useCallback(
    (module: PermissionModule, action: PermissionAction): boolean => {
      if (!user || user.type !== "admin") return false;
      return hasPermission(
        user.role as UserRole,
        user.permissions as Permissions | null | undefined,
        module,
        action
      );
    },
    [user]
  );

  const checkPageAccess = useCallback(
    (pathname: string): boolean => {
      if (!user || user.type !== "admin") return false;
      return canAccessPage(
        user.role as UserRole,
        user.permissions as Permissions | null | undefined,
        pathname
      );
    },
    [user]
  );

  const allowedModules = user?.type === "admin"
    ? getAllowedModules(
        user.role as UserRole,
        user.permissions as Permissions | null | undefined
      )
    : [];

  return {
    hasPermission: checkPermission,
    canAccessPage: checkPageAccess,
    allowedModules,
    isAdmin: user?.type === "admin",
    isSuperAdmin: user?.type === "admin" && user.role === "super_admin",
  };
}
