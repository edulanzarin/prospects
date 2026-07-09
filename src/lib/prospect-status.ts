import { StatusProspect } from "@/generated/prisma/enums";

export type StatusVisualKey = "prospeccao" | "alerta" | "cliente" | "perdido";

export interface StatusVisual {
  key: StatusVisualKey;
  label: string;
  bg: string;
  fg: string;
}

interface ProspectComAlerta {
  status: StatusProspect;
  cadastro: Date;
  diasAlertaCustom?: number | null;
}

/** Dias corridos entre `data` e hoje, ignorando o horário (meio-dia fixo evita bugs de fuso/DST). */
export function diasDesde(data: Date): number {
  const hoje = new Date();
  hoje.setHours(12, 0, 0, 0);
  const referencia = new Date(data);
  referencia.setHours(12, 0, 0, 0);
  return Math.round((hoje.getTime() - referencia.getTime()) / 86_400_000);
}

/** Prazo efetivo de alerta: o valor customizado do prospect, se houver, senão o padrão do sistema. */
export function limiteAlerta(prospect: ProspectComAlerta, diasAlertaPadrao: number): number {
  return prospect.diasAlertaCustom ?? diasAlertaPadrao;
}

/** Único ponto de decisão de quando um prospect ativo entra em alerta — nunca persistido no banco. */
export function isAlerta(prospect: ProspectComAlerta, diasAlertaPadrao: number): boolean {
  return prospect.status === "ATIVO" && diasDesde(prospect.cadastro) >= limiteAlerta(prospect, diasAlertaPadrao);
}

export function diasTexto(prospect: {
  status: StatusProspect;
  cadastro: Date;
  baixa?: Date | null;
}): string {
  if (prospect.status === "CLIENTE") return `cliente desde ${formatarDataCurta(prospect.baixa ?? null)}`;
  if (prospect.status === "PERDIDO") return `baixa em ${formatarDataCurta(prospect.baixa ?? null)}`;
  const dias = diasDesde(prospect.cadastro);
  if (dias === 0) return "cadastrado hoje";
  if (dias === 1) return "há 1 dia";
  return `há ${dias} dias`;
}

function formatarDataCurta(data: Date | null): string {
  if (!data) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
}

export function statusVisual(prospect: ProspectComAlerta, diasAlertaPadrao: number): StatusVisual {
  if (prospect.status === "CLIENTE") {
    return { key: "cliente", label: "Virou cliente", bg: "var(--color-cliente-bg)", fg: "var(--color-cliente-fg)" };
  }
  if (prospect.status === "PERDIDO") {
    return { key: "perdido", label: "Não fechou", bg: "var(--color-perdido-bg)", fg: "var(--color-perdido-fg)" };
  }
  if (isAlerta(prospect, diasAlertaPadrao)) {
    return { key: "alerta", label: "Em alerta", bg: "var(--color-alerta-bg)", fg: "var(--color-alerta-fg)" };
  }
  return { key: "prospeccao", label: "Em prospecção", bg: "var(--color-prospeccao-bg)", fg: "var(--color-prospeccao-fg)" };
}
