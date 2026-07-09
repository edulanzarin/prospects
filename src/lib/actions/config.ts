"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { smtpSchema } from "@/lib/validation/config.schema";
import { enviarEmailTeste } from "@/lib/mailer";
import type { ActionResult } from "@/lib/actions/prospects";

async function exigirAdmin() {
  const sessao = await auth();
  if (!sessao?.user || sessao.user.papel !== "ADMINISTRADOR") return null;
  return sessao;
}

export async function salvarSmtp(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await exigirAdmin();
  if (!sessao) return { ok: false, error: "Apenas administradores podem alterar o SMTP." };

  const parsed = smtpSchema.safeParse({
    host: formData.get("host"),
    port: formData.get("port"),
    user: formData.get("user"),
    pass: formData.get("pass"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Verifique os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const atual = await prisma.config.findUnique({ where: { id: "config" } });
  const smtpPass = parsed.data.pass ?? atual?.smtpPass;
  if (!smtpPass) {
    return { ok: false, error: "Informe a senha (senha de app, no caso do Gmail)." };
  }

  const dados = {
    smtpHost: parsed.data.host,
    smtpPort: parsed.data.port,
    smtpUser: parsed.data.user,
    smtpPass,
  };
  await prisma.config.upsert({
    where: { id: "config" },
    create: { id: "config", ...dados },
    update: dados,
  });

  revalidatePath("/configuracoes");
  return { ok: true };
}

export async function enviarEmailTesteSmtp(): Promise<ActionResult> {
  const sessao = await exigirAdmin();
  if (!sessao) return { ok: false, error: "Apenas administradores podem testar o SMTP." };

  const usuario = await prisma.usuario.findUnique({ where: { id: sessao.user.id } });
  if (!usuario) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  try {
    await enviarEmailTeste({ email: usuario.email, nome: usuario.nome });
    return { ok: true };
  } catch (erro) {
    const detalhe = erro instanceof Error ? erro.message : "erro desconhecido";
    return { ok: false, error: `Falha no envio: ${detalhe}` };
  }
}
