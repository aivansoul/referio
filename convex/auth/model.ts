import { generateOpaqueToken, hashToken } from "../../packages/security/src/tokens";

export const publicResetResponse = "Si un compte correspond à cette adresse, un email vous sera envoyé.";

export async function createExpiringToken(now: number, ttlMs: number) {
  const token = generateOpaqueToken();
  return { token, tokenHash: await hashToken(token), createdAt: now, expiresAt: now + ttlMs };
}
