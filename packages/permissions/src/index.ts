export const permissions = [
  "business.read", "business.update", "business.publish",
  "products.read", "products.create", "products.update", "products.delete",
  "media.read", "media.upload", "media.delete",
  "reviews.read", "reviews.reply", "reviews.moderate",
  "publications.create", "publications.publish", "publications.schedule",
  "analytics.read", "seo.read", "competitors.read",
  "recommendations.read", "recommendations.complete", "tasks.manage",
  "loyalty.configure", "rewards.manage", "members.invite", "members.remove",
  "billing.read", "billing.manage", "integrations.read", "integrations.manage",
] as const;

export type Permission = (typeof permissions)[number];
export type Role = "owner" | "admin" | "manager" | "editor" | "analyst" | "viewer";

const all = new Set<Permission>(permissions);
const matrix: Readonly<Record<Role, ReadonlySet<Permission>>> = {
  owner: all,
  admin: new Set(permissions.filter((p) => p !== "billing.manage")),
  manager: new Set(permissions.filter((p) => !p.startsWith("billing.") && !p.startsWith("members.") && p !== "integrations.manage")),
  editor: new Set(["business.read", "business.update", "products.read", "products.create", "products.update", "media.read", "media.upload", "reviews.read", "reviews.reply", "publications.create", "publications.publish", "publications.schedule", "recommendations.read", "recommendations.complete", "tasks.manage"]),
  analyst: new Set(["business.read", "products.read", "media.read", "reviews.read", "analytics.read", "seo.read", "competitors.read", "recommendations.read", "billing.read", "integrations.read"]),
  viewer: new Set(["business.read", "products.read", "media.read", "reviews.read", "recommendations.read"]),
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return matrix[role]?.has(permission) ?? false;
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) throw new AuthorizationError(permission);
}

export class AuthorizationError extends Error {
  constructor(public readonly permission: Permission) {
    super("Action non autorisée");
    this.name = "AuthorizationError";
  }
}
