"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, UserPlus, Settings, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import type { Papel } from "@/generated/prisma/enums";
import { PAPEL_LABELS } from "@/lib/labels";

interface SidebarProps {
  usuario: { nome: string; papel: Papel };
  alertasCount: number;
  /* Evita colisão de layoutId quando a sidebar desktop e a mobile estão montadas juntas. */
  mobile?: boolean;
}

const NAV_PRINCIPAL: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: boolean;
  /* Navegação completa — ver comentário no NavLink. */
  hard?: boolean;
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prospects", label: "Prospects", icon: Users, badge: true },
  { href: "/prospects/novo", label: "Cadastrar prospect", icon: UserPlus, hard: true },
];

export function Sidebar({ usuario, alertasCount, mobile }: SidebarProps) {
  const pathname = usePathname();
  const iniciais = usuario.nome
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  const isAtivo = (href: string) =>
    href === "/prospects"
      ? pathname === "/prospects" ||
        (pathname?.startsWith("/prospects/") && !pathname.startsWith("/prospects/novo"))
      : pathname === href;

  return (
    <aside className="flex h-full w-60 flex-shrink-0 flex-col border-r border-divider bg-sidebar backdrop-blur-2xl">
      <div className="flex items-center gap-2.5 px-5 pb-4 pt-6">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary-soft text-[15px] font-semibold text-primary">
          N
        </span>
        <div>
          <div className="text-sm font-semibold leading-tight tracking-tight text-ink">
            Navecon
          </div>
          <div className="text-[11px] leading-tight text-text-muted">Prospecção comercial</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col px-3.5 py-2">
        <SecaoLabel>Principal</SecaoLabel>
        <div className="flex flex-col gap-0.5">
          {NAV_PRINCIPAL.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              ativo={isAtivo(item.href)}
              mobile={mobile}
              hard={item.hard}
            >
              <item.icon size={17} strokeWidth={1.8} />
              {item.label}
              {item.badge && alertasCount > 0 && (
                <span className="ml-auto rounded-full bg-alerta-bg px-2 py-0.5 text-[10.5px] font-semibold text-alerta-fg">
                  {alertasCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <SecaoLabel className="mt-6">Outros</SecaoLabel>
        <div className="flex flex-col gap-0.5">
          <NavLink href="/configuracoes" ativo={isAtivo("/configuracoes")} mobile={mobile}>
            <Settings size={17} strokeWidth={1.8} />
            Configurações
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-divider px-3.5 py-3.5">
        <Link
          href="/configuracoes"
          className="mb-1.5 flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-primary-soft"
        >
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
            {iniciais}
          </span>
          <span className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-text">{usuario.nome}</div>
            <div className="text-[11px] text-text-faint">{PAPEL_LABELS[usuario.papel]}</div>
          </span>
        </Link>
        <form action={logout}>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-muted transition-colors hover:bg-alerta-bg hover:text-alerta-fg"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Sair
          </motion.button>
        </form>
      </div>
    </aside>
  );
}

function SecaoLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-text-faint ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}

function NavLink({
  href,
  ativo,
  mobile,
  hard,
  children,
}: {
  href: string;
  ativo: boolean;
  mobile?: boolean;
  hard?: boolean;
  children: React.ReactNode;
}) {
  const className = `relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    ativo ? "text-white" : "text-text-secondary hover:bg-primary-soft hover:text-ink"
  }`;
  const conteudo = (
    <>
      {ativo && (
        <motion.span
          layoutId={mobile ? "nav-pill-ativo-mobile" : "nav-pill-ativo"}
          className="absolute inset-0 rounded-lg bg-primary"
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
        />
      )}
      <span className="relative flex w-full items-center gap-2.5">{children}</span>
    </>
  );
  // hard: navegação completa — em navegação soft o interceptador
  // @modal/(.)prospects/[id] engole segmentos estáticos como "novo" e dá 404.
  if (hard) {
    return (
      <a href={href} className={className}>
        {conteudo}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {conteudo}
    </Link>
  );
}
