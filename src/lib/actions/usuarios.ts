"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUsuarioSchema, toggleUsuarioAtivoSchema } from "@/lib/validation/usuario.schema";
import type { ActionResult } from "@/lib/actions/prospects";

async function exigirAdmin() {
  const sessao = await auth();
  if (!sessao?.user || sessao.user.papel !== "ADMINISTRADOR") return null;
  return sessao;
}

export async function criarUsuario(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await exigirAdmin();
  if (!sessao) return { ok: false, error: "Apenas administradores podem criar usuários." };

  const parsed = createUsuarioSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    papel: formData.get("papel"),
    senha: formData.get("senha"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifique os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const emailExistente = await prisma.usuario.findUnique({ where: { email: parsed.data.email } });
  if (emailExistente) {
    return { ok: false, error: "Já existe um usuário com este e-mail." };
  }

  const senhaHash = await bcrypt.hash(parsed.data.senha, 10);
  await prisma.usuario.create({
    data: {
      nome: parsed.data.nome,
      email: parsed.data.email,
      papel: parsed.data.papel,
      senhaHash,
    },
  });

  revalidatePath("/configuracoes");
  return { ok: true };
}

export async function alternarUsuarioAtivo(_: unknown, formData: FormData): Promise<ActionResult> {
  const sessao = await exigirAdmin();
  if (!sessao) return { ok: false, error: "Apenas administradores podem alterar usuários." };

  const parsed = toggleUsuarioAtivoSchema.safeParse({
    usuarioId: formData.get("usuarioId"),
    ativo: formData.get("ativo") === "true",
  });
  if (!parsed.success) return { ok: false, error: "Requisição inválida." };

  // Desativar a si mesmo derrubaria a própria sessão na hora (callback jwt) e
  // poderia deixar o sistema sem nenhum administrador ativo.
  if (!parsed.data.ativo && parsed.data.usuarioId === sessao.user.id) {
    return { ok: false, error: "Você não pode desativar a própria conta." };
  }

  const { count } = await prisma.usuario.updateMany({
    where: { id: parsed.data.usuarioId },
    data: { ativo: parsed.data.ativo },
  });
  if (count === 0) return { ok: false, error: "Usuário não encontrado." };

  revalidatePath("/configuracoes");
  return { ok: true };
}
