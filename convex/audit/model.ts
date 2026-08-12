import { redactSensitive } from "../../packages/security/src/redaction";

export interface AuditEventInput { organizationId?: string; actorUserId?: string; action: string; targetType: string; targetId?: string; result: "success" | "denied" | "failure"; reason?: string; requestId: string; metadata?: unknown; createdAt: number }

export function prepareAuditEvent(input: AuditEventInput): AuditEventInput {
  return { ...input, metadata: redactSensitive(input.metadata) };
}
