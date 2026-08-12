import { z } from "zod";

export const emailSchema = z.string().trim().email().max(254);
export const passwordSchema = z.string().min(12).max(128).refine((value) => /[a-z]/u.test(value) && /[A-Z]/u.test(value) && /\d/u.test(value), "Le mot de passe doit contenir une minuscule, une majuscule et un chiffre.");
export const signupSchema = z.object({ email: emailSchema, password: passwordSchema, accountKind: z.enum(["professional", "customer"]) }).strict();
export const resetPasswordSchema = z.object({ token: z.string().min(32).max(256), password: passwordSchema, revokeSessions: z.boolean().default(true) }).strict();
