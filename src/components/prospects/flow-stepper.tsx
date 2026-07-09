import { AlertTriangle, CheckCircle2, CircleDashed, Handshake, UserPlus, XCircle } from "lucide-react";
import type { StatusProspect } from "@/generated/prisma/enums";
import { diasDesde } from "@/lib/prospect-status";
import { formatarData } from "@/lib/format";

type EstadoEtapa = "feita" | "atual" | "alerta" | "sucesso" | "perdido" | "pendente";

interface Etapa {
  label: string;
  sub: string;
  estado: EstadoEtapa;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

const ESTILO_ETAPA: Record<EstadoEtapa, { circulo: string; anel?: string }> = {
  feita: { circulo: "bg-primary-soft text-primary" },
  atual: { circulo: "bg-primary text-white", anel: "0 0 0 3.5px var(--color-primary-soft)" },
  alerta: { circulo: "bg-alerta-fg text-white", anel: "0 0 0 3.5px var(--color-alerta-bg)" },
  sucesso: { circulo: "bg-cliente-fg text-white" },
  perdido: { circulo: "bg-perdido-bg text-perdido-fg" },
  pendente: { circulo: "border border-dashed border-input-border bg-transparent text-text-faint" },
};

function diasEntre(inicio: Date, fim: Date): number {
  const a = new Date(inicio);
  const b = new Date(fim);
  a.setHours(12, 0, 0, 0);
  b.setHours(12, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** Fluxo do prospect em etapas: Cadastro → Prospecção → Desfecho. */
export function FlowStepper({
  prospect,
  emAlerta,
}: {
  prospect: { status: StatusProspect; cadastro: Date; baixa?: Date | null };
  emAlerta: boolean;
}) {
  const ativo = prospect.status === "ATIVO";
  const diasProspeccao = ativo
    ? diasDesde(prospect.cadastro)
    : prospect.baixa
      ? diasEntre(prospect.cadastro, prospect.baixa)
      : null;

  const etapas: Etapa[] = [
    {
      label: "Cadastro",
      sub: formatarData(prospect.cadastro),
      estado: "feita",
      icon: UserPlus,
    },
    ativo
      ? {
          label: "Prospecção",
          sub:
            diasProspeccao === 0
              ? "começou hoje"
              : `há ${diasProspeccao} ${diasProspeccao === 1 ? "dia" : "dias"}${emAlerta ? " · em alerta" : ""}`,
          estado: emAlerta ? "alerta" : "atual",
          icon: emAlerta ? AlertTriangle : Handshake,
        }
      : {
          label: "Prospecção",
          sub:
            diasProspeccao === null
              ? "encerrada"
              : `${diasProspeccao} ${diasProspeccao === 1 ? "dia" : "dias"} de contato`,
          estado: "feita",
          icon: Handshake,
        },
    ativo
      ? { label: "Desfecho", sub: "em aberto", estado: "pendente", icon: CircleDashed }
      : prospect.status === "CLIENTE"
        ? {
            label: "Virou cliente",
            sub: formatarData(prospect.baixa ?? null),
            estado: "sucesso",
            icon: CheckCircle2,
          }
        : {
            label: "Não fechou",
            sub: formatarData(prospect.baixa ?? null),
            estado: "perdido",
            icon: XCircle,
          },
  ];

  return (
    <div className="card flex items-center gap-3 overflow-x-auto px-5 py-4">
      {etapas.map((etapa, i) => {
        const estilo = ESTILO_ETAPA[etapa.estado];
        const proximaPendente = etapas[i + 1]?.estado === "pendente";
        return (
          <div key={etapa.label} className="flex min-w-0 flex-none items-center gap-3 sm:flex-1">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${estilo.circulo}`}
                style={estilo.anel ? { boxShadow: estilo.anel } : undefined}
              >
                <etapa.icon size={15} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold tracking-tight text-ink">
                  {etapa.label}
                </span>
                <span className="block truncate text-[11.5px] text-text-muted">{etapa.sub}</span>
              </span>
            </div>
            {i < etapas.length - 1 && (
              <span
                className={`hidden h-px min-w-6 flex-1 sm:block ${
                  proximaPendente ? "border-t border-dashed border-input-border" : "bg-card-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
