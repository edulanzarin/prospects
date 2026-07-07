"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { salvarAnexo, removerAnexo, UploadInvalidoError } from "@/lib/upload";
import type { ActionResult } from "@/lib/actions/prospects";

export async function enviarAnexo(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await auth();
  if (!sessao?.user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const prospectId = formData.get("prospectId");
  const arquivo = formData.get("arquivo");
  if (typeof prospectId !== "string" || !prospectId) {
    return { ok: false, error: "Prospect inválido." };
  }
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { ok: false, error: "Selecione um arquivo." };
  }

  try {
    const salvo = await salvarAnexo(prospectId, arquivo);
    await prisma.anexo.create({
      data: {
        prospectId,
        nomeOriginal: arquivo.name,
        caminho: salvo.caminho,
        mimeType: salvo.mimeType,
        tamanhoBytes: salvo.tamanhoBytes,
        uploaderId: sessao.user.id,
      },
    });
  } catch (erro) {
    if (erro instanceof UploadInvalidoError) {
      return { ok: false, error: erro.message };
    }
    throw erro;
  }

  await prisma.interacao.create({
    data: {
      prospectId,
      texto: `Anexo enviado: ${arquivo.name}.`,
      autorId: sessao.user.id,
    },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { ok: true };
}

export async function excluirAnexo(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await auth();
  if (!sessao?.user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const anexoId = formData.get("anexoId");
  if (typeof anexoId !== "string" || !anexoId) {
    return { ok: false, error: "Anexo inválido." };
  }

  const anexo = await prisma.anexo.findUnique({ where: { id: anexoId } });
  if (!anexo) return { ok: false, error: "Anexo não encontrado." };

  await removerAnexo(anexo.caminho);
  await prisma.anexo.delete({ where: { id: anexoId } });
  await prisma.interacao.create({
    data: {
      prospectId: anexo.prospectId,
      texto: `Anexo removido: ${anexo.nomeOriginal}.`,
      autorId: sessao.user.id,
    },
  });

  revalidatePath(`/prospects/${anexo.prospectId}`);
  return { ok: true };
}
