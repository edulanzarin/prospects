import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lerAnexo } from "@/lib/upload";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessao = await auth();
  if (!sessao?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const anexo = await prisma.anexo.findUnique({ where: { id } });
  if (!anexo) {
    return NextResponse.json({ error: "Anexo não encontrado." }, { status: 404 });
  }

  const buffer = await lerAnexo(anexo.caminho);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": anexo.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(anexo.nomeOriginal)}"`,
      "Content-Length": String(anexo.tamanhoBytes),
    },
  });
}
