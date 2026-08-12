import type { Role } from "../../packages/permissions/src/index";

export interface MembershipView { organizationId: string; userId: string; role: Role; status: "invited" | "active" | "suspended" | "removed" }

export function isActiveMembershipFor(membership: MembershipView | undefined, organizationId: string, userId: string): membership is MembershipView {
  return Boolean(membership && membership.organizationId === organizationId && membership.userId === userId && membership.status === "active");
}
