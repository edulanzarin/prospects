"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { Papel } from "@/generated/prisma/enums";

interface AppShellProps {
  usuario: { nome: string; papel: Papel };
  alertas: { id: string; empresa: string; contato: string; cadastro: Date }[];
  children: React.ReactNode;
}

export function AppShell({ usuario, alertas, children }: AppShellProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  // Fecha o menu mobile ao navegar para outra rota (ajuste de estado durante o render).
  const [pathAnterior, setPathAnterior] = useState(pathname);
  if (pathname !== pathAnterior) {
    setPathAnterior(pathname);
    if (menuAberto) setMenuAberto(false);
  }

  useEffect(() => {
    if (!menuAberto) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAberto(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuAberto]);

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block">
        <Sidebar usuario={usuario} alertasCount={alertas.length} />
      </div>

      <AnimatePresence>
        {menuAberto && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuAberto(false)}
            />
            <motion.div
              className="absolute inset-y-0 left-0"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 340 }}
            >
              <Sidebar usuario={usuario} alertasCount={alertas.length} mobile />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar alertas={alertas} onMenuClick={() => setMenuAberto(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
