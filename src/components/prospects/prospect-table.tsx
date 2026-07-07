"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

export function ProspectTable({ prospects }: { prospects: ProspectLinha[] }) {
  const router = useRouter();

  if (prospects.length === 0) {
    return (
      <div className="card px-7 py-10 text-center text-[13px] text-text-faint">
        Nenhum prospect encontrado com esses filtros.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-[#FAFBFC]">
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
              className="cursor-pointer border-b border-divider transition-colors last:border-b-0 hover:bg-[#FAFBFC]"
              style={{ background: p.visual.key === "alerta" ? "#FEF5F4" : undefined }}
            >
              <td className="py-4 pr-6 pl-5" style={{ boxShadow: `inset 3px 0 0 ${p.visual.fg}` }}>
                <div className="pl-2">
                  <div className="text-[14px] font-bold text-text">{p.empresa}</div>
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
                <div className="font-bold tabular-nums text-text">{formatarData(p.cadastro)}</div>
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
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-divider px-3 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-text-muted first:pl-7 last:px-6">
      {children}
    </th>
  );
}
