"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipContentProps,
} from "recharts";
import type { PontoSerie } from "@/lib/queries";
import { useTemaEscuro } from "@/components/ui/theme-toggle";

/* Paletas categóricas validadas por tema (CVD ΔE 80+, contraste ≥3:1 sobre a superfície). */
const TEMA_CLARO = {
  cadastros: "#1570EF",
  clientes: "#079455",
  grid: "#EEF1F5",
  tick: "#94A3B8",
  cursor: "#CBD5E1",
  dotStroke: "#FFFFFF",
};
const TEMA_ESCURO = {
  cadastros: "#3B82F6",
  clientes: "#0E9F6E",
  grid: "#1A2333",
  tick: "#5C6A80",
  cursor: "#33405A",
  dotStroke: "#121927",
};

function TooltipCustomizado({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-card-border bg-card px-3.5 py-2.5 text-[12.5px] shadow-lg">
      <div className="mb-1.5 font-semibold text-text">Dia {label}</div>
      {payload.map((item) => (
        <div key={item.dataKey as string} className="flex items-center gap-2 py-0.5">
          <span className="h-[2px] w-3 flex-none rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-text-muted">{item.name}</span>
          <span className="ml-auto font-semibold tabular-nums text-text">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ProspectsChart({ dados }: { dados: PontoSerie[] }) {
  const escuro = useTemaEscuro();
  const cores = escuro ? TEMA_ESCURO : TEMA_CLARO;
  const intervaloEixoX = Math.max(0, Math.ceil(dados.length / 8) - 1);

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-[12px] font-medium text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-[2px] w-3.5 rounded-full" style={{ backgroundColor: cores.cadastros }} />
          Cadastros
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[2px] w-3.5 rounded-full" style={{ backgroundColor: cores.clientes }} />
          Viraram cliente
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={dados} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={cores.grid} strokeWidth={1} />
          <XAxis
            dataKey="rotulo"
            interval={intervaloEixoX}
            tick={{ fontSize: 11, fill: cores.tick }}
            axisLine={{ stroke: cores.grid }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: cores.tick }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={TooltipCustomizado} cursor={{ stroke: cores.cursor, strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="cadastros"
            name="Cadastros"
            stroke={cores.cadastros}
            strokeWidth={2}
            dot={{ r: 3, fill: cores.cadastros, strokeWidth: 2, stroke: cores.dotStroke }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: cores.dotStroke }}
            animationDuration={600}
          />
          <Line
            type="monotone"
            dataKey="viraramCliente"
            name="Viraram cliente"
            stroke={cores.clientes}
            strokeWidth={2}
            dot={{ r: 3, fill: cores.clientes, strokeWidth: 2, stroke: cores.dotStroke }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: cores.dotStroke }}
            animationDuration={600}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
