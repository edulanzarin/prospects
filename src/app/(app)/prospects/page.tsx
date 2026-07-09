import Link from "next/link";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { getConfig, getProspectsFiltrados } from "@/lib/queries";
import type { StatusVisualKey } from "@/lib/prospect-status";
import { buttonClasses } from "@/components/ui/button";
import { ProspectFilters } from "@/components/prospects/prospect-filters";
import { ProspectTable } from "@/components/prospects/prospect-table";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata = { title: "Prospects" };

const POR_PAGINA = 20;

type StatusFiltro = "TODOS" | "ATIVO" | "ALERTA" | "CLIENTE" | "PERDIDO";

const ABAS: { status: StatusFiltro; label: string; key: StatusVisualKey | null }[] = [
  { status: "TODOS", label: "Todos", key: null },
  { status: "ALERTA", label: "Em alerta", key: "alerta" },
  { status: "ATIVO", label: "Em prospecção", key: "prospeccao" },
  { status: "CLIENTE", label: "Clientes", key: "cliente" },
  { status: "PERDIDO", label: "Não fecharam", key: "perdido" },
];

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    busca?: string;
    status?: string;
    origem?: string;
    cadastroDe?: string;
    cadastroAte?: string;
    pagina?: string;
  }>;
}) {
  const params = await searchParams;
  const config = await getConfig();

  const status = (["TODOS", "ATIVO", "ALERTA", "CLIENTE", "PERDIDO"].includes(params.status ?? "")
    ? params.status
    : "TODOS") as StatusFiltro;

  // Busca sem o filtro de status para as abas mostrarem a contagem de todos os grupos.
  const todosSemStatus = await getProspectsFiltrados(
    {
      busca: params.busca,
      status: "TODOS",
      origem: (params.origem as never) ?? "TODAS",
      cadastroDe: params.cadastroDe,
      cadastroAte: params.cadastroAte,
    },
    config.diasAlerta
  );

  const contagem: Record<StatusVisualKey, number> = {
    alerta: 0,
    prospeccao: 0,
    cliente: 0,
    perdido: 0,
  };
  for (const p of todosSemStatus) contagem[p.visual.key]++;

  const abaAtual = ABAS.find((t) => t.status === status) ?? ABAS[0];
  const filtrados = abaAtual.key
    ? todosSemStatus.filter((p) => p.visual.key === abaAtual.key)
    : todosSemStatus;

  const paginaAtual = Math.max(1, Number(params.pagina ?? 1) || 1);
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const pagina = filtrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  const queryBase = new URLSearchParams();
  if (params.busca) queryBase.set("busca", params.busca);
  if (params.status) queryBase.set("status", params.status);
  if (params.origem) queryBase.set("origem", params.origem);
  if (params.cadastroDe) queryBase.set("cadastroDe", params.cadastroDe);
  if (params.cadastroAte) queryBase.set("cadastroAte", params.cadastroAte);

  return (
    <div className="flex w-full max-w-[1680px] flex-col gap-4">
      <FadeIn>
        <ProspectFilters />
      </FadeIn>

      <FadeIn delay={0.05} className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-divider px-5 pt-1.5">
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {ABAS.map((aba) => {
              const total = aba.key ? contagem[aba.key] : todosSemStatus.length;
              const ativa = aba.status === status;
              const query = new URLSearchParams(queryBase);
              query.delete("pagina");
              if (aba.status === "TODOS") query.delete("status");
              else query.set("status", aba.status);
              return (
                <Link
                  key={aba.status}
                  href={`/prospects?${query.toString()}`}
                  className={`relative flex flex-none items-center gap-1.5 px-3 py-3 text-[13px] font-semibold transition-colors ${
                    ativa ? "text-primary" : "text-text-muted hover:text-text"
                  }`}
                >
                  {aba.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold ${
                      ativa ? "bg-primary-soft text-primary" : "bg-page text-text-muted"
                    }`}
                  >
                    {total}
                  </span>
                  {ativa && (
                    <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
          <a
            href={`/api/prospects/export?${queryBase.toString()}`}
            download
            className={buttonClasses("outline", "sm", "my-1.5 flex-none")}
          >
            <Download size={13} strokeWidth={2} />
            Exportar CSV
          </a>
        </div>
        <ProspectTable prospects={pagina} embutida />
      </FadeIn>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-4 px-1 text-[12.5px] text-text-muted">
          <PaginaLink queryBase={queryBase} pagina={paginaAtual - 1} disabled={paginaAtual <= 1}>
            <ChevronLeft size={15} strokeWidth={2} />
            Anterior
          </PaginaLink>
          <span className="font-semibold text-text-secondary">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <PaginaLink
            queryBase={queryBase}
            pagina={paginaAtual + 1}
            disabled={paginaAtual >= totalPaginas}
            fim
          >
            Próxima
            <ChevronRight size={15} strokeWidth={2} />
          </PaginaLink>
        </div>
      )}
    </div>
  );
}

function PaginaLink({
  queryBase,
  pagina,
  disabled,
  fim,
  children,
}: {
  queryBase: URLSearchParams;
  pagina: number;
  disabled: boolean;
  fim?: boolean;
  children: React.ReactNode;
}) {
  const classe = `flex items-center gap-1 font-semibold ${
    disabled ? "cursor-not-allowed text-text-faint" : "text-primary hover:text-primary-hover"
  } ${fim ? "flex-row-reverse" : ""}`;

  if (disabled) {
    return <span className={classe}>{children}</span>;
  }
  const params = new URLSearchParams(queryBase);
  params.set("pagina", String(pagina));
  return (
    <Link href={`/prospects?${params.toString()}`} className={classe}>
      {children}
    </Link>
  );
}
