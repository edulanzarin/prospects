"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, CalendarRange, X } from "lucide-react";
import { ORIGEM_OPTIONS } from "@/lib/labels";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const CAMPOS_FILTRO = ["busca", "status", "origem", "cadastroDe", "cadastroAte"];

export function ProspectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(debounceRef.current ?? undefined), []);

  function atualizar(chave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(chave, valor);
    else params.delete(chave);
    params.delete("pagina");
    router.push(`/prospects?${params.toString()}`);
  }

  /* Busca aplicada automaticamente enquanto digita, sem precisar de Enter. */
  function buscarComDebounce(valor: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => atualizar("busca", valor.trim()), 400);
  }

  const temFiltroAtivo = CAMPOS_FILTRO.some((campo) => !!searchParams.get(campo));

  return (
    <div className="card flex flex-wrap items-center gap-3 px-5 py-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (debounceRef.current) clearTimeout(debounceRef.current);
          const valor = (e.currentTarget.elements.namedItem("busca") as HTMLInputElement).value;
          atualizar("busca", valor.trim());
        }}
        className="min-w-[220px] max-w-[420px] flex-1"
      >
        <Input
          name="busca"
          defaultValue={searchParams.get("busca") ?? ""}
          onChange={(e) => buscarComDebounce(e.target.value)}
          placeholder="Buscar por empresa, contato ou CNPJ…"
          icon={<Search size={15} strokeWidth={2} />}
        />
      </form>

      <div className="flex items-center gap-1.5 text-text-faint">
        <Filter size={14} strokeWidth={2} />
      </div>

      <Select
        value={searchParams.get("origem") ?? "TODAS"}
        onValueChange={(valor) => atualizar("origem", valor)}
        options={[
          { value: "TODAS", label: "Origem: todas" },
          ...ORIGEM_OPTIONS.map(([valor, label]) => ({ value: valor, label })),
        ]}
        className="w-48"
      />

      <div className="flex items-center gap-1.5 rounded-xl border border-input-border bg-card px-3 py-1">
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
    </div>
  );
}
