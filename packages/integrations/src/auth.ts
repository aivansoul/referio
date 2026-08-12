export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, encodedHash: string): Promise<boolean>;
}

export interface TransactionalEmailProvider {
  sendEmailVerification(input: { to: string; verificationUrl: string; expiresAt: number }): Promise<void>;
  sendPasswordReset(input: { to: string; resetUrl: string; expiresAt: number }): Promise<void>;
  sendPasswordChanged(input: { to: string; occurredAt: number }): Promise<void>;
}
