import { Megaphone } from "lucide-react";
import { ORIGEM_LABELS } from "@/lib/labels";
import type { Origem } from "@/generated/prisma/enums";

interface OrigemPanelProps {
  origens: { origem: Origem; total: number }[];
}

/** De onde vêm os prospects — barras de hue único (magnitude), rotuladas diretamente. */
export function OrigemPanel({ origens }: OrigemPanelProps) {
  const maior = Math.max(1, ...origens.map((o) => o.total));

  return (
    <div className="card flex h-full flex-col p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-prospeccao-bg text-prospeccao-fg">
          <Megaphone size={15} strokeWidth={1.9} />
        </span>
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">
          Origem dos prospects
        </h3>
      </div>
      {origens.length === 0 ? (
        <div className="py-6 text-center text-[12.5px] text-text-faint">
          Sem dados ainda — cadastre prospects para ver a distribuição.
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-around gap-3">
          {origens.map((o) => (
            <div key={o.origem}>
              <div className="mb-1 flex items-baseline justify-between text-[12.5px]">
                <span className="font-medium text-text-secondary">{ORIGEM_LABELS[o.origem]}</span>
                <span className="font-semibold tabular-nums text-text">{o.total}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-page">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(4, (o.total / maior) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
