import { prisma } from "@/lib/prisma";
import { diasDesde, isAlerta, statusVisual } from "@/lib/prospect-status";
import type { Origem } from "@/generated/prisma/enums";

export async function getConfig() {
  const config = await prisma.config.findUnique({ where: { id: "config" } });
  return config ?? { id: "config", diasAlerta: 15, destacarLinhas: true };
}

/** Prospects ativos que já cruzaram o limiar de alerta — usado no sino, sidebar e dashboard. */
export async function getProspectsEmAlerta(diasAlerta: number) {
  const ativos = await prisma.prospect.findMany({
    where: { status: "ATIVO" },
    select: { id: true, empresa: true, contato: true, cadastro: true, diasAlertaCustom: true },
    orderBy: { cadastro: "asc" },
  });
  return ativos.filter((p) => isAlerta({ status: "ATIVO", ...p }, diasAlerta));
}

const ORDEM_STATUS_VISUAL = { alerta: 0, prospeccao: 1, cliente: 2, perdido: 3 } as const;

export interface ProspectsFiltro {
  busca?: string;
  status: "TODOS" | "ATIVO" | "ALERTA" | "CLIENTE" | "PERDIDO";
  origem: "TODAS" | Origem;
  cadastroDe?: string;
  cadastroAte?: string;
}

/** Filtra e ordena por prioridade de status (alerta > prospecção > cliente > perdido), com os cadastros mais recentes primeiro dentro de cada grupo. */
export async function getProspectsFiltrados(filtro: ProspectsFiltro, diasAlerta: number) {
  const busca = filtro.busca?.trim().toLowerCase();

  const prospects = await prisma.prospect.findMany({
    where: {
      ...(filtro.origem !== "TODAS" ? { origem: filtro.origem } : {}),
      ...(filtro.status === "ATIVO" || filtro.status === "ALERTA" ? { status: "ATIVO" } : {}),
      ...(filtro.status === "CLIENTE" ? { status: "CLIENTE" } : {}),
      ...(filtro.status === "PERDIDO" ? { status: "PERDIDO" } : {}),
      ...(filtro.cadastroDe || filtro.cadastroAte
        ? {
            cadastro: {
              ...(filtro.cadastroDe ? { gte: new Date(`${filtro.cadastroDe}T00:00:00Z`) } : {}),
              ...(filtro.cadastroAte ? { lte: new Date(`${filtro.cadastroAte}T23:59:59Z`) } : {}),
            },
          }
        : {}),
    },
  });

  const enriquecidos = prospects
    .map((p) => ({ ...p, visual: statusVisual(p, diasAlerta), dias: diasDesde(p.cadastro) }))
    .filter(
      (p) =>
        !busca ||
        p.empresa.toLowerCase().includes(busca) ||
        p.contato.toLowerCase().includes(busca) ||
        (p.cnpj ?? "").toLowerCase().includes(busca)
    )
    .filter((p) => filtro.status !== "ALERTA" || p.visual.key === "alerta");

  enriquecidos.sort((a, b) => {
    const ordem = ORDEM_STATUS_VISUAL[a.visual.key] - ORDEM_STATUS_VISUAL[b.visual.key];
    return ordem !== 0 ? ordem : b.criadoEm.getTime() - a.criadoEm.getTime();
  });

  return enriquecidos;
}

export interface PontoSerie {
  rotulo: string;
  cadastros: number;
  viraramCliente: number;
}

/** Série diária do mês corrente (dia 1 até o último dia do mês) para o gráfico do dashboard. */
export async function getSerieCadastrosMesAtual(): Promise<PontoSerie[]> {
  const agora = new Date();
  const ano = agora.getUTCFullYear();
  const mes = agora.getUTCMonth();
  const totalDias = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();

  const buckets: PontoSerie[] = Array.from({ length: totalDias }, (_, i) => ({
    rotulo: String(i + 1).padStart(2, "0"),
    cadastros: 0,
    viraramCliente: 0,
  }));

  const inicioMes = new Date(Date.UTC(ano, mes, 1));
  const inicioProximoMes = new Date(Date.UTC(ano, mes + 1, 1));

  const [cadastrados, viraramCliente] = await Promise.all([
    prisma.prospect.findMany({
      where: { cadastro: { gte: inicioMes, lt: inicioProximoMes } },
      select: { cadastro: true },
    }),
    prisma.prospect.findMany({
      where: { status: "CLIENTE", baixa: { gte: inicioMes, lt: inicioProximoMes } },
      select: { baixa: true },
    }),
  ]);

  for (const p of cadastrados) {
    const dia = p.cadastro.getUTCDate();
    if (dia >= 1 && dia <= totalDias) buckets[dia - 1].cadastros++;
  }
  for (const c of viraramCliente) {
    if (!c.baixa) continue;
    const dia = c.baixa.getUTCDate();
    if (dia >= 1 && dia <= totalDias) buckets[dia - 1].viraramCliente++;
  }

  return buckets;
}
