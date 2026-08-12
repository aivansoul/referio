import { requirePermission, type Permission } from "../../packages/permissions/src/index";
import type { Role } from "../../packages/permissions/src/index";

export interface AuthorizationMembership {
  organizationId: string;
  userId: string;
  role: Role;
  status: "invited" | "active" | "suspended" | "removed";
}

export function requireOrganizationPermission(membership: AuthorizationMembership | null, userId: string, organizationId: string, permission: Permission) {
  if (!membership || membership.organizationId !== organizationId || membership.userId !== userId || membership.status !== "active") throw new Error("Action non autorisée");
  requirePermission(membership.role, permission);
  return membership;
}
