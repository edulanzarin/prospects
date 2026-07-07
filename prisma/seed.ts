import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const usuariosExistentes = await prisma.usuario.count();
  if (usuariosExistentes === 0) {
    const email = process.env.ADMIN_EMAIL ?? "admin@navecon.com.br";
    const senha = process.env.ADMIN_PASSWORD ?? "changeme";
    const nome = process.env.ADMIN_NOME ?? "Administrador";

    const senhaHash = await bcrypt.hash(senha, 10);
    await prisma.usuario.create({
      data: { nome, email, senhaHash, papel: "ADMINISTRADOR" },
    });
    console.log(`[seed] Usuário administrador criado: ${email}`);
  } else {
    console.log("[seed] Usuários já existem — nada a fazer.");
  }

  const configExistente = await prisma.config.findUnique({ where: { id: "config" } });
  if (!configExistente) {
    await prisma.config.create({ data: { id: "config" } });
    console.log("[seed] Config padrão criada.");
  } else {
    console.log("[seed] Config já existe — nada a fazer.");
  }
}

main()
  .catch((erro) => {
    console.error("[seed] Falhou:", erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
