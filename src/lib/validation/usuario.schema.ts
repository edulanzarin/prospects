import { z } from "zod";
import { Papel } from "@/generated/prisma/enums";

const papelValues = Object.keys(Papel) as [Papel, ...Papel[]];

export const createUsuarioSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome"),
  email: z.string().trim().email("E-mail inválido"),
  papel: z.enum(papelValues),
  senha: z.string().min(8, "A senha precisa ter ao menos 8 caracteres"),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;

export const toggleUsuarioAtivoSchema = z.object({
  usuarioId: z.string().min(1),
  ativo: z.coerce.boolean(),
});

export const contaSchema = z.object({
  receberAlertaEmail: z.coerce.boolean(),
});

export const trocarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "Informe a senha atual"),
    novaSenha: z.string().min(8, "A nova senha precisa ter ao menos 8 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });
