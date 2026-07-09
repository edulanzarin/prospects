"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createProspectSchema,
  interacaoSchema,
  updateStatusSchema,
  updateProspectSchema,
} from "@/lib/validation/prospect.schema";
import { ORIGEM_LABELS, SERVICO_LABELS } from "@/lib/labels";
import { salvarAnexo, TIPOS_PERMITIDOS, TAMANHO_MAXIMO_BYTES } from "@/lib/upload";
import type { Origem, Servico } from "@/generated/prisma/enums";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function criarProspect(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await auth();
  if (!sessao?.user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const parsed = createProspectSchema.safeParse({
    empresa: formData.get("empresa"),
    cnpj: formData.get("cnpj"),
    contato: formData.get("contato"),
    telefone: formData.get("telefone"),
    email: formData.get("email"),
    origem: formData.get("origem"),
    servico: formData.get("servico"),
    cadastro: formData.get("cadastro"),
    obs: formData.get("obs"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Valida os anexos antes de criar o prospect: se um arquivo for recusado
  // depois, o prospect já estaria meio-criado no banco.
  const anexos = formData.getAll("anexos").filter((f): f is File => f instanceof File && f.size > 0);
  for (const arquivo of anexos) {
    if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
      return {
        ok: false,
        error: `"${arquivo.name}": tipo de arquivo não permitido. Envie PDF, JPG ou PNG.`,
      };
    }
    if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
      return { ok: false, error: `"${arquivo.name}": arquivo maior que 15MB.` };
    }
  }

  const prospect = await prisma.prospect.create({
    data: {
      ...parsed.data,
      cadastro: new Date(`${parsed.data.cadastro}T12:00:00`),
    },
  });

  await prisma.interacao.create({
    data: {
      prospectId: prospect.id,
      texto: "Prospect cadastrado.",
      autorId: sessao.user.id,
    },
  });

  for (const arquivo of anexos) {
    const salvo = await salvarAnexo(prospect.id, arquivo);
    await prisma.anexo.create({
      data: {
        prospectId: prospect.id,
        nomeOriginal: arquivo.name,
        caminho: salvo.caminho,
        mimeType: salvo.mimeType,
        tamanhoBytes: salvo.tamanhoBytes,
        uploaderId: sessao.user.id,
      },
    });
  }

  revalidatePath("/prospects");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function adicionarInteracao(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await auth();
  if (!sessao?.user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const parsed = interacaoSchema.safeParse({
    prospectId: formData.get("prospectId"),
    texto: formData.get("texto"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Descreva o que aconteceu no contato." };
  }

  const existe = await prisma.prospect.findUnique({
    where: { id: parsed.data.prospectId },
    select: { id: true },
  });
  if (!existe) return { ok: false, error: "Prospect não encontrado. Ele pode ter sido removido." };

  await prisma.interacao.create({
    data: {
      prospectId: parsed.data.prospectId,
      texto: parsed.data.texto,
      autorId: sessao.user.id,
    },
  });

  revalidatePath(`/prospects/${parsed.data.prospectId}`);
  return { ok: true };
}

const CAMPOS_EDITAVEIS: {
  chave: "empresa" | "cnpj" | "contato" | "telefone" | "email" | "origem" | "servico" | "obs";
  rotulo: string;
  formatar?: (v: string) => string;
}[] = [
  { chave: "empresa", rotulo: "Empresa" },
  { chave: "cnpj", rotulo: "CNPJ" },
  { chave: "contato", rotulo: "Contato" },
  { chave: "telefone", rotulo: "Telefone" },
  { chave: "email", rotulo: "E-mail" },
  { chave: "origem", rotulo: "Origem", formatar: (v) => ORIGEM_LABELS[v as Origem] },
  { chave: "servico", rotulo: "Serviço", formatar: (v) => SERVICO_LABELS[v as Servico] },
  { chave: "obs", rotulo: "Observações" },
];

export async function atualizarProspect(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await auth();
  if (!sessao?.user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const parsed = updateProspectSchema.safeParse({
    prospectId: formData.get("prospectId"),
    empresa: formData.get("empresa"),
    cnpj: formData.get("cnpj"),
    contato: formData.get("contato"),
    telefone: formData.get("telefone"),
    email: formData.get("email"),
    origem: formData.get("origem"),
    servico: formData.get("servico"),
    obs: formData.get("obs"),
    diasAlertaCustom: formData.get("diasAlertaCustom"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { prospectId, diasAlertaCustom, ...dados } = parsed.data;
  const atual = await prisma.prospect.findUnique({ where: { id: prospectId } });
  if (!atual) return { ok: false, error: "Prospect não encontrado. Ele pode ter sido removido." };

  const mudancas: string[] = [];
  for (const campo of CAMPOS_EDITAVEIS) {
    const novoValor = dados[campo.chave] ?? "";
    const valorAtual = atual[campo.chave] ?? "";
    if (novoValor === valorAtual) continue;
    const formatar = campo.formatar ?? ((v: string) => (v ? v : "—"));
    mudancas.push(`${campo.rotulo}: "${formatar(valorAtual)}" → "${formatar(novoValor)}"`);
  }

  if (diasAlertaCustom !== atual.diasAlertaCustom) {
    const formatarPrazo = (v: number | null) => (v === null ? "padrão do sistema" : `${v} dias`);
    mudancas.push(
      `Prazo de alerta: "${formatarPrazo(atual.diasAlertaCustom)}" → "${formatarPrazo(diasAlertaCustom)}"`
    );
  }

  if (mudancas.length === 0) return { ok: true };

  await prisma.prospect.update({ where: { id: prospectId }, data: { ...dados, diasAlertaCustom } });
  await prisma.interacao.create({
    data: {
      prospectId,
      texto: `Dados atualizados: ${mudancas.join("; ")}.`,
      autorId: sessao.user.id,
    },
  });

  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/prospects");
  return { ok: true };
}

export async function atualizarStatusProspect(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const sessao = await auth();
  if (!sessao?.user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const parsed = updateStatusSchema.safeParse({
    prospectId: formData.get("prospectId"),
    acao: formData.get("acao"),
  });
  if (!parsed.success) return { ok: false, error: "Ação inválida." };

  const { prospectId, acao } = parsed.data;
  const hoje = new Date();
  hoje.setHours(12, 0, 0, 0);

  const dadosPorAcao = {
    VIROU_CLIENTE: { status: "CLIENTE" as const, baixa: hoje, baixaPorId: sessao.user.id },
    NAO_FECHOU: { status: "PERDIDO" as const, baixa: hoje, baixaPorId: sessao.user.id },
    REABRIR: { status: "ATIVO" as const, baixa: null, baixaPorId: null },
  };
  const textoPorAcao = {
    VIROU_CLIENTE: "Baixa manual: virou cliente.",
    NAO_FECHOU: "Baixa manual: não fechou.",
    REABRIR: "Prospecção reaberta.",
  };

  const { count } = await prisma.prospect.updateMany({
    where: { id: prospectId },
    data: dadosPorAcao[acao],
  });
  if (count === 0) {
    return { ok: false, error: "Prospect não encontrado. Ele pode ter sido removido." };
  }
  await prisma.interacao.create({
    data: { prospectId, texto: textoPorAcao[acao], autorId: sessao.user.id },
  });

  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/prospects");
  revalidatePath("/dashboard");
  return { ok: true };
}
