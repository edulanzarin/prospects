"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contaSchema, trocarSenhaSchema } from "@/lib/validation/usuario.schema";
import type { ActionResult } from "@/lib/actions/prospects";

export async function atualizarPreferenciaEmail(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const sessao = await auth();
  if (!sessao?.user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const parsed = contaSchema.safeParse({
    receberAlertaEmail: formData.get("receberAlertaEmail") === "on",
  });
  if (!parsed.success) return { ok: false, error: "Requisição inválida." };

  const { count } = await prisma.usuario.updateMany({
    where: { id: sessao.user.id },
    data: { receberAlertaEmail: parsed.data.receberAlertaEmail },
  });
  if (count === 0) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  revalidatePath("/configuracoes");
  return { ok: true };
}

export async function trocarSenha(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await auth();
  if (!sessao?.user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const parsed = trocarSenhaSchema.safeParse({
    senhaAtual: formData.get("senhaAtual"),
    novaSenha: formData.get("novaSenha"),
    confirmarSenha: formData.get("confirmarSenha"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Verifique os campos.",
    };
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: sessao.user.id } });
  if (!usuario) return { ok: false, error: "Sessão expirada. Faça login novamente." };
  const senhaValida = await bcrypt.compare(parsed.data.senhaAtual, usuario.senhaHash);
  if (!senhaValida) {
    return { ok: false, error: "Senha atual incorreta." };
  }

  const senhaHash = await bcrypt.hash(parsed.data.novaSenha, 10);
  await prisma.usuario.update({ where: { id: usuario.id }, data: { senhaHash } });

  return { ok: true };
}
