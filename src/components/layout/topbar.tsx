"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, ChevronRight, Menu, Plus, Search } from "lucide-react";
import { diasDesde } from "@/lib/prospect-status";
import { buttonClasses } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface Titulo {
  test: (p: string) => boolean;
  titulo: string;
  trilha: string[];
}

const TITULOS: Titulo[] = [
  { test: (p) => p === "/dashboard", titulo: "Dashboard", trilha: ["Início"] },
  {
    test: (p) => p === "/prospects/novo",
    titulo: "Cadastrar prospect",
    trilha: ["Prospects", "Novo"],
  },
  { test: (p) => p === "/prospects", titulo: "Prospects", trilha: ["Comercial"] },
  {
    test: (p) => p.startsWith("/prospects/"),
    titulo: "Detalhes do prospect",
    trilha: ["Prospects", "Detalhes"],
  },
  { test: (p) => p === "/configuracoes", titulo: "Configurações", trilha: ["Conta"] },
];

interface TopbarProps {
  alertas: { id: string; empresa: string; contato: string; cadastro: Date }[];
  onMenuClick?: () => void;
}

export function Topbar({ alertas, onMenuClick }: TopbarProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const atual = TITULOS.find((item) => item.test(pathname));
  const titulo = atual?.titulo ?? "Navecon";

  useEffect(() => {
    function onClickFora(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", onClickFora);
    return () => document.removeEventListener("mousedown", onClickFora);
  }, []);

  return (
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between gap-3 border-b border-divider bg-card-translucent backdrop-blur-2xl px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="-ml-1 flex h-9 w-9 flex-none items-center justify-center rounded-full text-text-muted transition-colors hover:bg-page lg:hidden"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>
        <motion.div
          key={titulo}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-w-0"
        >
          <h1 className="truncate text-[17px] font-semibold tracking-tight text-ink sm:text-[18px]">
            {titulo}
          </h1>
          {atual && (
            <div className="hidden items-center gap-1 text-[11.5px] text-text-faint sm:flex">
              {atual.trilha.map((parte) => (
                <span key={parte} className="flex items-center gap-1">
                  {parte}
                  <ChevronRight size={11} strokeWidth={2} />
                </span>
              ))}
              <span className="font-medium text-text-muted">{titulo}</span>
            </div>
          )}
        </motion.div>
      </div>
      <div className="flex flex-none items-center gap-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem("busca") as HTMLInputElement;
            router.push(`/prospects?busca=${encodeURIComponent(input.value.trim())}`);
            input.blur();
          }}
          className="relative hidden lg:block"
        >
          <Search
            size={14}
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
          />
          <input
            name="busca"
            placeholder="Buscar prospect…"
            className="w-52 rounded-[10px] border border-input-border bg-card py-1.5 pl-8.5 pr-4 text-[12.5px] text-text outline-none transition-all placeholder:text-text-faint focus:w-64 focus:border-primary focus:shadow-[0_0_0_3.5px_var(--color-primary-soft)]"
          />
        </form>
        <ThemeToggle />
        <div ref={containerRef} className="relative">
          <motion.button
            type="button"
            onClick={() => setAberto((v) => !v)}
            whileTap={{ scale: 0.9 }}
            animate={alertas.length > 0 ? { rotate: [0, -12, 10, -6, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary-soft"
            aria-label="Notificações"
          >
            <Bell size={17} strokeWidth={1.8} />
            {alertas.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-alerta-fg px-1 text-[9.5px] font-semibold text-white">
                {alertas.length}
              </span>
            )}
          </motion.button>
          <AnimatePresence>
            {aberto && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="card absolute right-0 top-11 z-20 w-80 origin-top-right overflow-hidden py-2 shadow-[var(--shadow-float)]!"
              >
                <div className="border-b border-divider px-4 py-2 text-[12.5px] font-semibold text-ink">
                  Prospects em alerta
                </div>
                {alertas.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-7 text-center text-[12.5px] text-text-muted">
                    <BellOff size={18} strokeWidth={1.8} className="text-text-faint" />
                    Nenhum alerta no momento.
                  </div>
                ) : (
                  <ul className="max-h-72 overflow-y-auto">
                    {alertas.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/prospects/${p.id}`}
                          onClick={() => setAberto(false)}
                          className="block px-4 py-2.5 transition-colors hover:bg-page"
                        >
                          <div className="text-[13px] font-semibold text-text">{p.empresa}</div>
                          <div className="text-[11.5px] text-text-muted">
                            {p.contato} · {diasDesde(p.cadastro)} dias sem virar cliente
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* <a>: navegação soft para /prospects/novo é engolida pelo interceptador (.)prospects/[id] */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/prospects/novo" className={buttonClasses("primary", "sm", "hidden sm:inline-flex")}>
          <Plus size={14} strokeWidth={2.4} />
          Novo prospect
        </a>
      </div>
    </header>
  );
}
