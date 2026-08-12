import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEmail } from "../../packages/domain/src/identity";
import { hasPermission, requirePermission, AuthorizationError } from "../../packages/permissions/src/index";
import { generateOpaqueToken, hashToken, isUsableToken } from "../../packages/security/src/tokens";
import { redactSensitive } from "../../packages/security/src/redaction";
import { consumeRateLimit, RateLimitError } from "../../packages/security/src/rate-limit";
import { signupSchema } from "../../packages/validation/src/auth";
import { createExpiringToken, publicResetResponse } from "../../convex/auth/model";
import { isActiveMembershipFor } from "../../convex/organizations/model";

test("normalise un e-mail avant unicité", () => assert.equal(normalizeEmail("  Lana@EXAMPLE.COM "), "lana@example.com"));
test("RBAC refuse par défaut les permissions sensibles", () => {
  assert.equal(hasPermission("viewer", "billing.manage"), false);
  assert.equal(hasPermission("owner", "billing.manage"), true);
  assert.throws(() => requirePermission("manager", "billing.manage"), AuthorizationError);
});
test("un membership d’un autre tenant ne donne aucun accès", () => {
  const membership = { organizationId: "org-a", userId: "user-a", role: "owner" as const, status: "active" as const };
  assert.equal(isActiveMembershipFor(membership, "org-b", "user-a"), false);
  assert.equal(isActiveMembershipFor(membership, "org-a", "user-b"), false);
});
test("les tokens sont opaques, hashés et expirables", async () => {
  const token = generateOpaqueToken();
  assert.ok(token.length >= 43);
  assert.notEqual(await hashToken(token), token);
  assert.equal(isUsableToken({ expiresAt: 101 }, 100), true);
  assert.equal(isUsableToken({ expiresAt: 101, usedAt: 99 }, 100), false);
  const expiring = await createExpiringToken(1_000, 60_000);
  assert.equal(expiring.expiresAt, 61_000);
});
test("le reset utilise une réponse non énumérable", () => assert.match(publicResetResponse, /Si un compte correspond/));
test("le rate limit bloque après la limite", () => {
  const policy = { limit: 2, windowMs: 60_000, blockMs: 120_000 };
  let bucket = consumeRateLimit(undefined, policy, 0);
  bucket = consumeRateLimit(bucket, policy, 1);
  assert.throws(() => consumeRateLimit(bucket, policy, 2), RateLimitError);
});
test("les logs masquent récursivement les secrets", () => assert.deepEqual(redactSensitive({ email: "a@b.be", nested: { password: "x", token: "y" } }), { email: "a@b.be", nested: { password: "[REDACTED]", token: "[REDACTED]" } }));
test("la validation impose un mot de passe robuste", () => {
  assert.equal(signupSchema.safeParse({ email: "a@b.be", password: "weak", accountKind: "customer" }).success, false);
  assert.equal(signupSchema.safeParse({ email: "a@b.be", password: "LongPassword9", accountKind: "customer" }).success, true);
});
