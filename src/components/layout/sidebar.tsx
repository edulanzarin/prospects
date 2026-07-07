"use client";

import Image from "next/image";
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
}

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: boolean;
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prospects", label: "Prospects", icon: Users, badge: true },
  { href: "/prospects/novo", label: "Cadastrar prospect", icon: UserPlus },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ usuario, alertasCount }: SidebarProps) {
  const pathname = usePathname();
  const iniciais = usuario.nome
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="flex h-full w-[252px] flex-shrink-0 flex-col bg-navy text-white">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <Image
          src="/logo-navecon.png"
          alt="Navecon"
          width={34}
          height={34}
          className="h-[34px] w-[34px] rounded-lg"
        />
        <div>
          <div className="font-display text-[17px] font-semibold leading-tight tracking-wide">
            Navecon
          </div>
          <div className="text-[11px] text-white/55">Prospecção comercial</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3.5 py-2">
        {NAV_ITEMS.map((item) => {
          const ativo =
            item.href === "/prospects"
              ? pathname === "/prospects" ||
                (pathname?.startsWith("/prospects/") && !pathname.startsWith("/prospects/novo"))
              : pathname === item.href;
          return (
            <NavLink key={item.href} href={item.href} ativo={ativo}>
              <item.icon size={17} strokeWidth={1.8} />
              {item.label}
              {item.badge && alertasCount > 0 && (
                <span className="ml-auto rounded-full bg-alerta-fg px-1.5 py-0.5 text-[10.5px] font-bold text-white">
                  {alertasCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <Link
          href="/configuracoes"
          className="mb-2 flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.08]"
        >
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gold text-[12px] font-bold text-navy">
            {iniciais}
          </span>
          <span className="min-w-0">
            <div className="truncate text-[13px] font-semibold">{usuario.nome}</div>
            <div className="text-[11px] text-white/55">{PAPEL_LABELS[usuario.papel]}</div>
          </span>
        </Link>
        <form action={logout}>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Sair
          </motion.button>
        </form>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  ativo,
  children,
}: {
  href: string;
  ativo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
        ativo ? "text-navy" : "text-white/80 hover:bg-white/[0.08] hover:text-white"
      }`}
    >
      {ativo && (
        <motion.span
          layoutId="nav-pill-ativo"
          className="absolute inset-0 rounded-xl bg-gold"
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
        />
      )}
      <span className="relative flex w-full items-center gap-2.5">{children}</span>
    </Link>
  );
}
