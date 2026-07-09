import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { diasTexto } from "@/lib/prospect-status";
import { formatarData } from "@/lib/format";
import { SERVICO_LABELS } from "@/lib/labels";
import type { Servico, StatusProspect } from "@/generated/prisma/enums";

interface AlertaPanelProps {
  prospects: {
    id: string;
    empresa: string;
    contato: string;
    servico: Servico;
    cadastro: Date;
    status: StatusProspect;
  }[];
}

export function AlertaPanel({ prospects }: AlertaPanelProps) {
  return (
    <div className="card h-full overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-alerta-bg text-alerta-fg">
          <AlertTriangle size={15} strokeWidth={1.9} />
        </span>
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">
          Prospects em alerta
        </h3>
        <Link
          href="/prospects?status=ALERTA"
          className="ml-auto flex flex-none items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
        >
          Ver todos
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>
      {prospects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-9 text-center text-[12.5px] text-text-faint">
          <CheckCircle2 size={22} strokeWidth={1.6} className="text-cliente-fg" />
          Nenhum prospect passou do prazo · tudo em dia
        </div>
      ) : (
        prospects.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 border-t border-t-divider border-l-[3px] border-l-alerta-fg px-6 py-4 transition-colors hover:bg-alerta-bg"
          >
            <span className="h-2 w-2 flex-none rounded-full bg-alerta-fg" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-semibold text-text">{p.empresa}</div>
              <div className="text-[11.5px] text-text-muted">
                {p.contato} · {SERVICO_LABELS[p.servico]}
              </div>
            </div>
            <div className="flex-none text-right">
              <div className="text-[12.5px] font-semibold text-text">{formatarData(p.cadastro)}</div>
              <div className="text-[11px] font-semibold text-alerta-fg">{diasTexto(p)}</div>
            </div>
            <Link href={`/prospects/${p.id}`} className={buttonClasses("outline", "sm", "flex-none")}>
              Ver
              <ChevronRight size={13} strokeWidth={2} />
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
