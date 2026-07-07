import Link from "next/link";
import { Clock, Plus } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { statusVisual } from "@/lib/prospect-status";
import { formatarData } from "@/lib/format";
import { ORIGEM_LABELS } from "@/lib/labels";
import type { Origem, StatusProspect } from "@/generated/prisma/enums";

interface RecentesPanelProps {
  diasAlerta: number;
  prospects: {
    id: string;
    empresa: string;
    origem: Origem;
    status: StatusProspect;
    cadastro: Date;
  }[];
}

export function RecentesPanel({ diasAlerta, prospects }: RecentesPanelProps) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-callout-bg text-callout-fg">
          <Clock size={15} strokeWidth={1.9} />
        </span>
        <h3 className="font-display text-[16px] font-bold tracking-wide text-navy">
          Últimos cadastros
        </h3>
        <Link
          href="/prospects/novo"
          className="ml-auto flex flex-none items-center gap-1 text-xs font-semibold text-link hover:text-gold"
        >
          <Plus size={13} strokeWidth={2.2} />
          Novo
        </Link>
      </div>
      {prospects.length === 0 ? (
        <div className="px-6 py-9 text-center text-[12.5px] text-text-faint">
          Nenhum prospect cadastrado ainda.
        </div>
      ) : (
        prospects.map((p) => (
          <Link
            key={p.id}
            href={`/prospects/${p.id}`}
            className="block border-t border-divider px-6 py-3.5 transition-colors hover:bg-[#FAFBFC]"
          >
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1 truncate text-[13px] font-bold text-text">
                {p.empresa}
              </div>
              <StatusBadge status={statusVisual(p, diasAlerta)} />
            </div>
            <div className="mt-0.5 text-[11.5px] text-text-muted">
              {ORIGEM_LABELS[p.origem]} · cadastrado em {formatarData(p.cadastro)}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
