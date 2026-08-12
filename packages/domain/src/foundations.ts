import { normalizeEmail, type AccountKind, type UserStatus } from "./identity";
import { createExpiringToken, publicResetResponse } from "../../../convex/auth/model";
import { isUsableToken } from "../../../packages/security/src/tokens";
import type { PasswordHasher, TransactionalEmailProvider } from "../../../packages/integrations/src/auth";

export interface FoundationUser { id: string; normalizedEmail: string; accountKind: AccountKind; status: UserStatus; emailVerifiedAt?: number }
export interface StoredToken { id: string; userId: string; tokenHash: string; expiresAt: number; usedAt?: number; invalidatedAt?: number }
export interface FoundationRepository {
  findUserByEmail(email: string): Promise<FoundationUser | null>;
  findUserById(id: string): Promise<FoundationUser | null>;
  createUser(input: { normalizedEmail: string; accountKind: AccountKind; passwordHash: string; now: number }): Promise<FoundationUser>;
  setEmailVerified(userId: string, now: number): Promise<void>;
  setPasswordHash(userId: string, passwordHash: string, now: number): Promise<void>;
  insertToken(kind: "email_verification" | "password_reset", input: Omit<StoredToken, "id">): Promise<void>;
  findTokenByHash(kind: "email_verification" | "password_reset", hash: string): Promise<StoredToken | null>;
  consumeToken(kind: "email_verification" | "password_reset", id: string, now: number): Promise<boolean>;
  invalidateUserTokens(kind: "email_verification" | "password_reset", userId: string, now: number): Promise<void>;
  revokeUserSessions(userId: string, now: number, reason: string): Promise<void>;
  appendAudit(input: { actorUserId?: string; action: string; targetType: string; targetId?: string; result: "success" | "denied" | "failure"; requestId: string; createdAt: number }): Promise<void>;
}

export class FoundationService {
  constructor(private readonly repository: FoundationRepository, private readonly passwords: PasswordHasher, private readonly email: TransactionalEmailProvider, private readonly baseUrl: string, private readonly now: () => number = Date.now) {}

  async signup(input: { email: string; password: string; accountKind: Exclude<AccountKind, "platform_admin">; requestId: string }): Promise<{ userId: string }> {
    const normalizedEmail = normalizeEmail(input.email);
    if (await this.repository.findUserByEmail(normalizedEmail)) throw new Error("Un compte existe déjà pour cette adresse.");
    const now = this.now();
    const user = await this.repository.createUser({ normalizedEmail, accountKind: input.accountKind, passwordHash: await this.passwords.hash(input.password), now });
    const token = await createExpiringToken(now, 24 * 60 * 60 * 1_000);
    await this.repository.insertToken("email_verification", { userId: user.id, tokenHash: token.tokenHash, expiresAt: token.expiresAt });
    await this.email.sendEmailVerification({ to: normalizedEmail, verificationUrl: `${this.baseUrl}/verifier-email?token=${encodeURIComponent(token.token)}`, expiresAt: token.expiresAt });
    await this.repository.appendAudit({ actorUserId: user.id, action: "auth.signup", targetType: "user", targetId: user.id, result: "success", requestId: input.requestId, createdAt: now });
    return { userId: user.id };
  }

  async verifyEmail(rawToken: string, requestId: string): Promise<void> {
    const { hashToken } = await import("../../../packages/security/src/tokens");
    const token = await this.repository.findTokenByHash("email_verification", await hashToken(rawToken));
    const now = this.now();
    if (!token || !isUsableToken(token, now) || !(await this.repository.consumeToken("email_verification", token.id, now))) throw new Error("Lien invalide ou expiré.");
    await this.repository.setEmailVerified(token.userId, now);
    await this.repository.invalidateUserTokens("email_verification", token.userId, now);
    await this.repository.appendAudit({ actorUserId: token.userId, action: "auth.email_verified", targetType: "user", targetId: token.userId, result: "success", requestId, createdAt: now });
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.repository.findUserByEmail(normalizeEmail(email));
    if (!user) return publicResetResponse;
    const now = this.now();
    await this.repository.invalidateUserTokens("password_reset", user.id, now);
    const token = await createExpiringToken(now, 30 * 60 * 1_000);
    await this.repository.insertToken("password_reset", { userId: user.id, tokenHash: token.tokenHash, expiresAt: token.expiresAt });
    await this.email.sendPasswordReset({ to: user.normalizedEmail, resetUrl: `${this.baseUrl}/nouveau-mot-de-passe?token=${encodeURIComponent(token.token)}`, expiresAt: token.expiresAt });
    return publicResetResponse;
  }

  async resetPassword(input: { rawToken: string; newPassword: string; revokeSessions: boolean; requestId: string }): Promise<void> {
    const { hashToken } = await import("../../../packages/security/src/tokens");
    const token = await this.repository.findTokenByHash("password_reset", await hashToken(input.rawToken));
    const now = this.now();
    if (!token || !isUsableToken(token, now) || !(await this.repository.consumeToken("password_reset", token.id, now))) throw new Error("Lien invalide ou expiré.");
    await this.repository.setPasswordHash(token.userId, await this.passwords.hash(input.newPassword), now);
    await this.repository.invalidateUserTokens("password_reset", token.userId, now);
    if (input.revokeSessions) await this.repository.revokeUserSessions(token.userId, now, "password_reset");
    const user = await this.repository.findUserById(token.userId);
    if (user) await this.email.sendPasswordChanged({ to: user.normalizedEmail, occurredAt: now });
    await this.repository.appendAudit({ actorUserId: token.userId, action: "auth.password_reset", targetType: "user", targetId: token.userId, result: "success", requestId: input.requestId, createdAt: now });
  }
}
