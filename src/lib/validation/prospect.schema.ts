import { z } from "zod";
import { Origem, Servico } from "@/generated/prisma/enums";
import { formatarCNPJ, formatarTelefone, soDigitos } from "@/lib/mask";

const origemValues = Object.keys(Origem) as [Origem, ...Origem[]];
const servicoValues = Object.keys(Servico) as [Servico, ...Servico[]];

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const cnpjSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? soDigitos(v) : undefined))
  .refine((v) => !v || v.length === 14, "CNPJ deve ter 14 dígitos")
  .transform((v) => (v ? formatarCNPJ(v) : undefined));

const telefoneSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? soDigitos(v) : undefined))
  .refine((v) => !v || v.length === 10 || v.length === 11, "Telefone deve ter DDD + número (10 ou 11 dígitos)")
  .transform((v) => (v ? formatarTelefone(v) : undefined));

const diasAlertaCustomSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined))
  .refine(
    (v) => v === undefined || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 365),
    "Informe um número de 1 a 365, ou deixe em branco para usar o padrão do sistema"
  )
  .transform((v) => (v === undefined ? null : Number(v)));

export const createProspectSchema = z.object({
  empresa: z.string().trim().min(1, "Informe o nome da empresa"),
  cnpj: cnpjSchema,
  contato: z.string().trim().min(1, "Informe o nome do contato"),
  telefone: telefoneSchema,
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, "E-mail inválido"),
  origem: z.enum(origemValues),
  servico: z.enum(servicoValues),
  cadastro: z.string().min(1, "Informe a data do primeiro contato"),
  obs: optionalText,
});

export type CreateProspectInput = z.infer<typeof createProspectSchema>;

export const updateProspectSchema = z.object({
  prospectId: z.string().min(1),
  empresa: z.string().trim().min(1, "Informe o nome da empresa"),
  cnpj: cnpjSchema,
  contato: z.string().trim().min(1, "Informe o nome do contato"),
  telefone: telefoneSchema,
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, "E-mail inválido"),
  origem: z.enum(origemValues),
  servico: z.enum(servicoValues),
  obs: optionalText,
  diasAlertaCustom: diasAlertaCustomSchema,
});

export type UpdateProspectInput = z.infer<typeof updateProspectSchema>;

export const interacaoSchema = z.object({
  prospectId: z.string().min(1),
  texto: z.string().trim().min(1, "Descreva o que aconteceu"),
});

export const updateStatusSchema = z.object({
  prospectId: z.string().min(1),
  acao: z.enum(["VIROU_CLIENTE", "NAO_FECHOU", "REABRIR"]),
});

export const prospectsQuerySchema = z.object({
  busca: z.string().trim().optional(),
  status: z.enum(["TODOS", "ATIVO", "ALERTA", "CLIENTE", "PERDIDO"]).default("TODOS"),
  origem: z.enum(["TODAS", ...origemValues]).default("TODAS"),
  pagina: z.coerce.number().int().min(1).default(1),
});
