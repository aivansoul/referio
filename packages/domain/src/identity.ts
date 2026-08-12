export type AccountKind = "professional" | "customer" | "platform_admin";
export type UserStatus = "pending_verification" | "active" | "locked" | "suspended";

export interface UserIdentity {
  id: string;
  normalizedEmail: string;
  accountKind: AccountKind;
  status: UserStatus;
  emailVerifiedAt?: number;
}

export function normalizeEmail(value: string): string {
  return value.trim().normalize("NFKC").toLocaleLowerCase("en-US");
}

export function canAuthenticate(user: UserIdentity): boolean {
  return user.status === "active" || user.status === "pending_verification";
}
