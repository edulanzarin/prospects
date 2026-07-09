/* Dados de demonstração para desenvolvimento — não roda em produção. */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.usuario.findFirstOrThrow();
  const diasAtras = (n: number) => new Date(Date.now() - n * 86_400_000);

  await prisma.prospect.createMany({
    data: [
      {
        empresa: "Metalúrgica Horizonte LTDA",
        contato: "Carla Menezes",
        telefone: "(47) 99911-2233",
        email: "carla@horizonte.ind.br",
        origem: "INDICACAO",
        servico: "TROCA_CONTABILIDADE",
        cadastro: diasAtras(4),
        obs: "Indicada pelo cliente Baía Sul. Pediu proposta para 12 funcionários.",
      },
      {
        empresa: "Transportes Litoral Sul",
        contato: "Rodrigo Farias",
        telefone: "(48) 98822-4455",
        origem: "SITE",
        servico: "ABERTURA_EMPRESA",
        cadastro: diasAtras(40),
        obs: "Sem retorno desde o segundo contato.",
      },
      {
        empresa: "Pousada Mar Azul",
        contato: "Fernanda Ribeiro",
        email: "fernanda@marazul.com.br",
        origem: "REDES_SOCIAIS",
        servico: "TROCA_CONTABILIDADE",
        cadastro: diasAtras(25),
        status: "CLIENTE",
        baixa: diasAtras(3),
        baixaPorId: admin.id,
      },
    ],
  });
  console.log("[seed-demo] 3 prospects de demonstração criados.");
}

main().finally(() => prisma.$disconnect());
