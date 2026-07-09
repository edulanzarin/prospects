import { z } from "zod";

export const smtpSchema = z.object({
  host: z.string().trim().min(1, "Informe o servidor SMTP"),
  port: z.coerce
    .number()
    .int("Porta inválida")
    .min(1, "Porta inválida")
    .max(65535, "Porta inválida"),
  user: z
    .string()
    .trim()
    .min(1, "Informe o e-mail de envio")
    .refine((v) => z.string().email().safeParse(v).success, "E-mail inválido"),
  // Em branco mantém a senha já salva (o campo nunca é pré-preenchido no form).
  pass: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});
