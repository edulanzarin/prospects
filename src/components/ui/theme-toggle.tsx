"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

/** Tema atual, reativo à classe `dark` no <html> — funciona em qualquer client component. */
export function useTemaEscuro() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => true // snapshot do servidor: o padrão do sistema é escuro
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const escuro = useTemaEscuro();

  function alternar() {
    const novo = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", novo);
    try {
      localStorage.setItem("tema", novo ? "escuro" : "claro");
    } catch {
      /* preferência não persistida — segue só na sessão */
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={escuro ? "Ativar modo claro" : "Ativar modo noturno"}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary-soft ${className ?? ""}`.trim()}
    >
      {escuro ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
    </button>
  );
}
