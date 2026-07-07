"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, CalendarDays } from "lucide-react";
import { diasDesde } from "@/lib/prospect-status";

const TITULOS: { test: (p: string) => boolean; titulo: string }[] = [
  { test: (p) => p === "/dashboard", titulo: "Dashboard" },
  { test: (p) => p === "/prospects/novo", titulo: "Cadastrar prospect" },
  { test: (p) => p === "/prospects", titulo: "Prospects" },
  { test: (p) => p.startsWith("/prospects/"), titulo: "Detalhes do prospect" },
  { test: (p) => p === "/configuracoes", titulo: "Configurações" },
];

interface TopbarProps {
  alertas: { id: string; empresa: string; contato: string; cadastro: Date }[];
}

export function Topbar({ alertas }: TopbarProps) {
  const pathname = usePathname() ?? "";
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titulo = TITULOS.find((item) => item.test(pathname))?.titulo ?? "Navecon";
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

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
    <header className="flex h-16 flex-shrink-0 items-center justify-between bg-white px-8 shadow-[0_1px_0_rgba(16,24,40,0.06)]">
      <div>
        <motion.h1
          key={titulo}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-display text-[19px] font-semibold tracking-wide text-navy"
        >
          {titulo}
        </motion.h1>
      </div>
      <div className="flex items-center gap-5">
        <span className="flex items-center gap-1.5 text-[12.5px] capitalize text-text-muted">
          <CalendarDays size={14} strokeWidth={1.8} />
          {hoje}
        </span>
        <div ref={containerRef} className="relative">
          <motion.button
            type="button"
            onClick={() => setAberto((v) => !v)}
            whileTap={{ scale: 0.9 }}
            animate={alertas.length > 0 ? { rotate: [0, -12, 10, -6, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-page"
            aria-label="Notificações"
          >
            <Bell size={18} strokeWidth={1.8} />
            {alertas.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-alerta-fg px-1 text-[9.5px] font-bold text-white">
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
                className="card absolute right-0 top-11 z-20 w-80 origin-top-right overflow-hidden py-2"
              >
                <div className="border-b border-divider px-4 py-2 text-[12.5px] font-bold text-navy">
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
      </div>
    </header>
  );
}
