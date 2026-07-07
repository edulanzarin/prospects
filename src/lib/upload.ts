import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");

const MIME_EXTENSOES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export const TIPOS_PERMITIDOS = Object.keys(MIME_EXTENSOES);
export const TAMANHO_MAXIMO_BYTES = 15 * 1024 * 1024; // 15MB

export class UploadInvalidoError extends Error {}

export async function salvarAnexo(prospectId: string, file: File) {
  if (!(file.type in MIME_EXTENSOES)) {
    throw new UploadInvalidoError("Tipo de arquivo não permitido. Envie PDF, JPG ou PNG.");
  }
  if (file.size > TAMANHO_MAXIMO_BYTES) {
    throw new UploadInvalidoError("Arquivo maior que 15MB.");
  }

  const pastaProspect = path.join(UPLOADS_DIR, prospectId);
  await mkdir(pastaProspect, { recursive: true });

  const nomeArmazenado = `${randomUUID()}.${MIME_EXTENSOES[file.type]}`;
  const destino = path.join(pastaProspect, nomeArmazenado);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destino, buffer);

  return {
    caminho: path.join(prospectId, nomeArmazenado),
    mimeType: file.type,
    tamanhoBytes: file.size,
  };
}

export async function lerAnexo(caminhoRelativo: string) {
  const caminhoAbsoluto = path.join(UPLOADS_DIR, caminhoRelativo);
  if (!caminhoAbsoluto.startsWith(path.resolve(UPLOADS_DIR))) {
    throw new UploadInvalidoError("Caminho de arquivo inválido.");
  }
  return readFile(caminhoAbsoluto);
}

export async function removerAnexo(caminhoRelativo: string) {
  const caminhoAbsoluto = path.join(UPLOADS_DIR, caminhoRelativo);
  await unlink(caminhoAbsoluto).catch(() => undefined);
}
