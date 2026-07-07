import Link from "next/link";
import { ChevronLeft, ChevronRight, Users, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { getConfig, getProspectsFiltrados } from "@/lib/queries";
import { ProspectFilters } from "@/components/prospects/prospect-filters";
import { ProspectTable } from "@/components/prospects/prospect-table";
import { FadeIn } from "@/components/ui/fade-in";

const POR_PAGINA = 20;

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
    : "TODOS") as "TODOS" | "ATIVO" | "ALERTA" | "CLIENTE" | "PERDIDO";

  const todosFiltrados = await getProspectsFiltrados(
    {
      busca: params.busca,
      status,
      origem: (params.origem as never) ?? "TODAS",
      cadastroDe: params.cadastroDe,
      cadastroAte: params.cadastroAte,
    },
    config.diasAlerta
  );

  const paginaAtual = Math.max(1, Number(params.pagina ?? 1) || 1);
  const totalPaginas = Math.max(1, Math.ceil(todosFiltrados.length / POR_PAGINA));
  const pagina = todosFiltrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  const queryBase = new URLSearchParams();
  if (params.busca) queryBase.set("busca", params.busca);
  if (params.status) queryBase.set("status", params.status);
  if (params.origem) queryBase.set("origem", params.origem);
  if (params.cadastroDe) queryBase.set("cadastroDe", params.cadastroDe);
  if (params.cadastroAte) queryBase.set("cadastroAte", params.cadastroAte);

  const contagem = { alerta: 0, prospeccao: 0, cliente: 0, perdido: 0 };
  for (const p of todosFiltrados) contagem[p.visual.key]++;

  return (
    <div className="flex w-full max-w-[1680px] flex-col gap-4">
      <FadeIn>
        <StatsStrip total={todosFiltrados.length} contagem={contagem} />
      </FadeIn>
      <FadeIn delay={0.05}>
        <ProspectFilters />
      </FadeIn>
      <ProspectTable prospects={pagina} />

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

function StatsStrip({
  total,
  contagem,
}: {
  total: number;
  contagem: { alerta: number; prospeccao: number; cliente: number; perdido: number };
}) {
  const itens = [
    { label: "Resultados", valor: total, icon: Users, cor: "#041E41" },
    { label: "Em alerta", valor: contagem.alerta, icon: AlertTriangle, cor: "#C0392B" },
    { label: "Clientes", valor: contagem.cliente, icon: CheckCircle2, cor: "#1E7E4C" },
    { label: "Não fecharam", valor: contagem.perdido, icon: XCircle, cor: "#667085" },
  ];

  return (
    <div className="card grid grid-cols-2 divide-x divide-divider overflow-hidden sm:grid-cols-4">
      {itens.map((item) => (
        <div key={item.label} className="flex items-center gap-3 px-5 py-4">
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: item.cor }}
          >
            <item.icon size={17} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <div className="font-display text-[22px] leading-none font-extrabold tracking-tight text-text">
              {item.valor}
            </div>
            <div className="mt-1 truncate text-[11px] font-semibold tracking-wide text-text-muted uppercase">
              {item.label}
            </div>
          </div>
        </div>
      ))}
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
    disabled ? "cursor-not-allowed text-text-faint" : "text-link hover:text-gold"
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
