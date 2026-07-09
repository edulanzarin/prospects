"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SearchX, Plus, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonClasses } from "@/components/ui/button";
import { diasTexto, type StatusVisual } from "@/lib/prospect-status";
import { formatarData } from "@/lib/format";
import { ORIGEM_LABELS, SERVICO_LABELS } from "@/lib/labels";
import type { Origem, Servico, StatusProspect } from "@/generated/prisma/enums";

interface ProspectLinha {
  id: string;
  empresa: string;
  cnpj: string | null;
  contato: string;
  telefone: string | null;
  servico: Servico;
  origem: Origem;
  cadastro: Date;
  status: StatusProspect;
  baixa: Date | null;
  visual: StatusVisual;
}

export function ProspectTable({
  prospects,
  embutida,
}: {
  prospects: ProspectLinha[];
  embutida?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (prospects.length === 0) {
    const temFiltro = searchParams.toString().length > 0;
    return (
      <div
        className={`flex flex-col items-center gap-4 px-7 py-12 text-center ${embutida ? "" : "card"}`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-page text-text-faint">
          <SearchX size={24} strokeWidth={1.6} />
        </span>
        <div>
          <div className="text-[14.5px] font-semibold text-text">
            {temFiltro ? "Nenhum prospect encontrado" : "Nenhum prospect cadastrado ainda"}
          </div>
          <div className="mt-1 text-[12.5px] text-text-muted">
            {temFiltro
              ? "Ajuste ou limpe os filtros para ver outros resultados."
              : "Cadastre o primeiro prospect para começar o acompanhamento."}
          </div>
        </div>
        {temFiltro ? (
          <Link href="/prospects" className={buttonClasses("outline", "sm")}>
            <X size={13} strokeWidth={2.2} />
            Limpar filtros
          </Link>
        ) : (
          <Link href="/prospects/novo" className={buttonClasses("primary", "sm")}>
            <Plus size={13} strokeWidth={2.4} />
            Cadastrar prospect
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={embutida ? "" : "card overflow-hidden"}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-[13px]">
        <thead>
          <tr className="bg-hover-row">
            <Th>Empresa</Th>
            <Th>Contato</Th>
            <Th>Serviço de interesse</Th>
            <Th>Origem</Th>
            <Th>Cadastro</Th>
            <Th>Status</Th>
            <th className="border-b border-divider" />
          </tr>
        </thead>
        <tbody>
          {prospects.map((p, index) => (
            <motion.tr
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.995 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.4) }}
              onClick={() => router.push(`/prospects/${p.id}`)}
              className="cursor-pointer border-b border-divider transition-colors last:border-b-0 hover:bg-hover-row"
              style={{ background: p.visual.key === "alerta" ? "var(--color-alerta-bg)" : undefined }}
            >
              <td className="py-4 pr-6 pl-5" style={{ boxShadow: `inset 3px 0 0 ${p.visual.fg}` }}>
                <div className="pl-2">
                  <div className="text-[14px] font-semibold text-text">{p.empresa}</div>
                  <div className="text-[11.5px] text-text-faint">{p.cnpj ?? "—"}</div>
                </div>
              </td>
              <td className="px-3 py-4">
                <div className="font-medium text-text-secondary">{p.contato}</div>
                <div className="text-[11.5px] text-text-faint">{p.telefone ?? "—"}</div>
              </td>
              <td className="px-3 py-4 text-text-secondary">{SERVICO_LABELS[p.servico]}</td>
              <td className="px-3 py-4 text-text-muted">{ORIGEM_LABELS[p.origem]}</td>
              <td className="px-3 py-4">
                <div className="font-semibold tabular-nums text-text">{formatarData(p.cadastro)}</div>
                <div className="text-[11px] font-semibold" style={{ color: p.visual.fg }}>
                  {diasTexto(p)}
                </div>
              </td>
              <td className="px-3 py-4">
                <StatusBadge status={p.visual} />
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/prospects/${p.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={buttonClasses("outline", "sm")}
                >
                  Detalhes
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-divider px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted first:pl-7 last:px-6">
      {children}
    </th>
  );
}
