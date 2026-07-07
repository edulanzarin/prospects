export function formatarData(data: Date | null | undefined): string {
  if (!data) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
}

/** Para timestamps reais (Interacao.data, Anexo.criadoEm) — mostra data + hora em horário de Brasília. */
export function formatarDataHora(data: Date | null | undefined): string {
  if (!data) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}
