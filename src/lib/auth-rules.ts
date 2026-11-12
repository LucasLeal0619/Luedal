import { z } from "zod";
export const emailSchema = z.string().trim().email("Informe um e-mail válido.").max(255);
export const passwordSchema = z.string().min(8, "Use pelo menos 8 caracteres.").max(128);
export const signupSchema = z.object({ name: z.string().trim().min(2, "Informe seu nome completo.").max(80), email: emailSchema, password: passwordSchema, confirm: z.string() }).refine(v => v.password === v.confirm, { message: "As senhas não coincidem.", path: ["confirm"] });
export const resetSchema = z.object({ password: passwordSchema, confirm: z.string() }).refine(v => v.password === v.confirm, { message: "As senhas não coincidem.", path: ["confirm"] });
export function authError(code?: string) {
  if (code === "invalid_credentials") return "E-mail ou senha incorretos.";
  if (code === "email_not_confirmed") return "Confirme seu e-mail antes de entrar.";
  if (code?.includes("rate_limit")) return "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
  if (code === "user_already_exists") return "Não foi possível criar a conta. Tente entrar ou recuperar seu acesso.";
  if (code === "weak_password") return "Escolha uma senha mais forte, com pelo menos 8 caracteres.";
  return "Não foi possível concluir a solicitação. Verifique sua conexão e tente novamente.";
}
export const destination = (onboarded: boolean) => onboarded ? "/dashboard" : "/onboarding";
export function canEnterWorkspace(userId: string | null, explicitDemo: boolean) { return Boolean(userId) || explicitDemo; }