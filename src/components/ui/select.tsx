"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  /** Nome enviado no form via input hidden — igual a um select nativo. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Select customizado (listbox) — dropdown estilizado nos dois temas,
 * já que o popup do <select> nativo não aceita estilo.
 */
export function Select({
  options,
  name,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecionar…",
  icon,
  className,
}: SelectProps) {
  const [interno, setInterno] = useState(defaultValue ?? "");
  const selecionado = value !== undefined ? value : interno;
  const [aberto, setAberto] = useState(false);
  const [destacado, setDestacado] = useState(-1);
  const raizRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const atual = options.find((o) => o.value === selecionado);

  function escolher(valor: string) {
    if (value === undefined) setInterno(valor);
    onValueChange?.(valor);
    setAberto(false);
  }

  function abrir() {
    setDestacado(options.findIndex((o) => o.value === selecionado));
    setAberto(true);
  }

  useEffect(() => {
    if (!aberto) return;
    function onClickFora(e: MouseEvent) {
      if (raizRef.current && !raizRef.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", onClickFora);
    return () => document.removeEventListener("mousedown", onClickFora);
  }, [aberto]);

  useEffect(() => {
    if (!aberto || destacado < 0) return;
    listaRef.current
      ?.querySelectorAll("[role=option]")
      [destacado]?.scrollIntoView({ block: "nearest" });
  }, [aberto, destacado]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setAberto(false);
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!aberto) return abrir();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setDestacado((d) => Math.min(options.length - 1, Math.max(0, d + delta)));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!aberto) abrir();
      else if (destacado >= 0) escolher(options[destacado].value);
    }
  }

  return (
    <div ref={raizRef} className={`relative ${className ?? ""}`.trim()}>
      {name && <input type="hidden" name={name} value={selecionado} />}
      <button
        type="button"
        role="combobox"
        aria-expanded={aberto}
        aria-controls={listboxId}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={onKeyDown}
        className={`campo-input flex w-full items-center gap-2 text-left ${icon ? "pl-9" : ""} ${
          aberto ? "border-primary! shadow-[0_0_0_3.5px_var(--color-primary-soft)]" : ""
        }`}
      >
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">
            {icon}
          </span>
        )}
        <span className={`flex-1 truncate ${atual ? "" : "text-text-faint"}`}>
          {atual?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`flex-none text-text-faint transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            ref={listaRef}
            id={listboxId}
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-64 origin-top overflow-y-auto rounded-xl border border-card-border bg-card p-1.5 shadow-[var(--shadow-float)]"
          >
            {options.map((opcao, i) => {
              const ativo = opcao.value === selecionado;
              return (
                <button
                  key={opcao.value}
                  type="button"
                  role="option"
                  aria-selected={ativo}
                  onClick={() => escolher(opcao.value)}
                  onMouseEnter={() => setDestacado(i)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                    ativo ? "font-semibold text-primary" : "text-text-secondary"
                  } ${destacado === i ? "bg-page" : ""}`}
                >
                  <span className="flex-1 truncate">{opcao.label}</span>
                  {ativo && <Check size={14} strokeWidth={2.4} className="flex-none text-primary" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
