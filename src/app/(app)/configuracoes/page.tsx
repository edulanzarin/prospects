import { redirect } from "next/navigation";
import { Users, ShieldCheck, UserCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAPEL_LABELS } from "@/lib/labels";
import { ContaForm } from "@/components/account/conta-form";
import { TrocarSenhaForm } from "@/components/account/trocar-senha-form";
import { UsuariosPanel } from "@/components/config/usuarios-panel";
import { FadeIn } from "@/components/ui/fade-in";

function iniciaisDe(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function ConfiguracoesPage() {
  const sessao = await auth();
  if (!sessao?.user) redirect("/login");
  const usuario = await prisma.usuario.findUniqueOrThrow({ where: { id: sessao.user.id } });
  const usuarios =
    usuario.papel === "ADMINISTRADOR"
      ? await prisma.usuario.findMany({ orderBy: { criadoEm: "asc" } })
      : null;

  return (
    <div className="flex w-full max-w-[1680px] flex-col gap-5">
      <FadeIn className="card flex items-center gap-4 px-7 py-6">
        <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gold text-[18px] font-extrabold text-navy">
          {iniciaisDe(usuario.nome)}
        </span>
        <div className="min-w-0">
          <div className="font-display text-[21px] font-extrabold tracking-tight text-navy">
            {usuario.nome}
          </div>
          <div className="mt-0.5 text-[13px] text-text-muted">{usuario.email}</div>
        </div>
        <span
          className={`ml-auto flex-none rounded-full px-3 py-1.5 text-[11.5px] font-bold ${
            usuario.papel === "ADMINISTRADOR"
              ? "bg-prospeccao-bg text-prospeccao-fg"
              : "bg-page text-text-muted"
          }`}
        >
          {PAPEL_LABELS[usuario.papel]}
        </span>
      </FadeIn>

      {usuarios && (
        <FadeIn delay={0.05}>
          <EquipeStats usuarios={usuarios} />
        </FadeIn>
      )}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        <FadeIn delay={0.1}>
          <ContaForm receberAlertaEmail={usuario.receberAlertaEmail} email={usuario.email} />
        </FadeIn>
        <FadeIn delay={0.15}>
          <TrocarSenhaForm />
        </FadeIn>
      </div>

      {usuarios && (
        <FadeIn delay={0.2}>
          <UsuariosPanel usuarios={usuarios} />
        </FadeIn>
      )}
    </div>
  );
}

function EquipeStats({
  usuarios,
}: {
  usuarios: { papel: "ADMINISTRADOR" | "COMERCIAL"; ativo: boolean }[];
}) {
  const total = usuarios.length;
  const admins = usuarios.filter((u) => u.papel === "ADMINISTRADOR").length;
  const ativos = usuarios.filter((u) => u.ativo).length;

  const itens = [
    { label: "Usuários da equipe", valor: total, icon: Users, cor: "#041E41" },
    { label: "Administradores", valor: admins, icon: ShieldCheck, cor: "#2C5DA8" },
    { label: "Ativos", valor: ativos, icon: UserCheck, cor: "#1E7E4C" },
  ];

  return (
    <div className="card grid grid-cols-1 divide-x-0 divide-y divide-divider overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
