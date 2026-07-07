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

const COR_CADASTROS = "#2C5DA8";
const COR_CLIENTES = "#1E7E4C";

function TooltipCustomizado({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-card-border bg-white px-3.5 py-2.5 text-[12.5px] shadow-lg">
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
  const intervaloEixoX = Math.max(0, Math.ceil(dados.length / 8) - 1);

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-[12px] font-medium text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-[2px] w-3.5 rounded-full" style={{ backgroundColor: COR_CADASTROS }} />
          Cadastros
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[2px] w-3.5 rounded-full" style={{ backgroundColor: COR_CLIENTES }} />
          Viraram cliente
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={dados} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EEF0F3" strokeWidth={1} />
          <XAxis
            dataKey="rotulo"
            interval={intervaloEixoX}
            tick={{ fontSize: 11, fill: "#98A2B3" }}
            axisLine={{ stroke: "#EEF0F3" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#98A2B3" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={TooltipCustomizado} cursor={{ stroke: "#D5DAE1", strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="cadastros"
            name="Cadastros"
            stroke={COR_CADASTROS}
            strokeWidth={2}
            dot={{ r: 3, fill: COR_CADASTROS, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
            animationDuration={600}
          />
          <Line
            type="monotone"
            dataKey="viraramCliente"
            name="Viraram cliente"
            stroke={COR_CLIENTES}
            strokeWidth={2}
            dot={{ r: 3, fill: COR_CLIENTES, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
            animationDuration={600}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
