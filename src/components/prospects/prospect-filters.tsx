"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, Plus, CalendarRange, X } from "lucide-react";
import { ORIGEM_OPTIONS } from "@/lib/labels";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { buttonClasses } from "@/components/ui/button";

const CAMPOS_FILTRO = ["busca", "status", "origem", "cadastroDe", "cadastroAte"];

export function ProspectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function atualizar(chave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(chave, valor);
    else params.delete(chave);
    params.delete("pagina");
    router.push(`/prospects?${params.toString()}`);
  }

  const temFiltroAtivo = CAMPOS_FILTRO.some((campo) => !!searchParams.get(campo));

  return (
    <div className="card flex flex-wrap items-center gap-3 px-5 py-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const valor = (e.currentTarget.elements.namedItem("busca") as HTMLInputElement).value;
          atualizar("busca", valor);
        }}
        className="max-w-[420px] flex-1"
      >
        <Input
          name="busca"
          defaultValue={searchParams.get("busca") ?? ""}
          placeholder="Buscar por empresa, contato ou CNPJ…"
          icon={<Search size={15} strokeWidth={2} />}
        />
      </form>

      <div className="flex items-center gap-1.5 text-text-faint">
        <Filter size={14} strokeWidth={2} />
      </div>

      <Select
        value={searchParams.get("status") ?? "TODOS"}
        onChange={(e) => atualizar("status", e.target.value)}
        className="w-auto"
      >
        <option value="TODOS">Status: todos</option>
        <option value="ALERTA">Em alerta</option>
        <option value="ATIVO">Em prospecção</option>
        <option value="CLIENTE">Viraram clientes</option>
        <option value="PERDIDO">Não fecharam</option>
      </Select>

      <Select
        value={searchParams.get("origem") ?? "TODAS"}
        onChange={(e) => atualizar("origem", e.target.value)}
        className="w-auto"
      >
        <option value="TODAS">Origem: todas</option>
        {ORIGEM_OPTIONS.map(([valor, label]) => (
          <option key={valor} value={valor}>
            {label}
          </option>
        ))}
      </Select>

      <div className="flex items-center gap-1.5 rounded-xl border border-input-border bg-white px-3 py-1">
        <CalendarRange size={14} strokeWidth={1.9} className="flex-none text-text-faint" />
        <input
          type="date"
          aria-label="Cadastro a partir de"
          value={searchParams.get("cadastroDe") ?? ""}
          onChange={(e) => atualizar("cadastroDe", e.target.value)}
          className="w-[120px] bg-transparent py-1 text-[12.5px] text-text-secondary outline-none"
        />
        <span className="text-text-faint">–</span>
        <input
          type="date"
          aria-label="Cadastro até"
          value={searchParams.get("cadastroAte") ?? ""}
          onChange={(e) => atualizar("cadastroAte", e.target.value)}
          className="w-[120px] bg-transparent py-1 text-[12.5px] text-text-secondary outline-none"
        />
      </div>

      {temFiltroAtivo && (
        <button
          type="button"
          onClick={() => router.push("/prospects")}
          className="flex items-center gap-1 text-xs font-semibold text-text-faint hover:text-alerta-fg"
        >
          <X size={13} strokeWidth={2.2} />
          Limpar
        </button>
      )}

      <Link href="/prospects/novo" className={buttonClasses("primary", "md", "ml-auto")}>
        <Plus size={15} strokeWidth={2.4} />
        Novo prospect
      </Link>
    </div>
  );
}
