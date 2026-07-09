import { redirect } from "next/navigation";
import { Users, ShieldCheck, UserCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAPEL_LABELS } from "@/lib/labels";
import { getConfig } from "@/lib/queries";
import { ContaForm } from "@/components/account/conta-form";
import { TrocarSenhaForm } from "@/components/account/trocar-senha-form";
import { UsuariosPanel } from "@/components/config/usuarios-panel";
import { SmtpPanel } from "@/components/config/smtp-panel";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata = { title: "Configurações" };

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
  const usuario = await prisma.usuario.findUnique({ where: { id: sessao.user.id } });
  // Sessão válida mas usuário sumiu do banco (removido, ou banco de dev recriado): força novo login.
  if (!usuario) redirect("/login");
  const ehAdmin = usuario.papel === "ADMINISTRADOR";
  const usuarios = ehAdmin ? await prisma.usuario.findMany({ orderBy: { criadoEm: "asc" } }) : null;
  const config = ehAdmin ? await getConfig() : null;

  return (
    <div className="flex w-full max-w-[1680px] flex-col gap-5">
      <FadeIn className="card flex items-center gap-4 px-7 py-6">
        <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-primary text-[18px] font-extrabold text-white">
          {iniciaisDe(usuario.nome)}
        </span>
        <div className="min-w-0">
          <div className="text-[20px] font-semibold text-ink">
            {usuario.nome}
          </div>
          <div className="mt-0.5 text-[13px] text-text-muted">{usuario.email}</div>
        </div>
        <span
          className={`ml-auto flex-none rounded-full px-3 py-1.5 text-[11.5px] font-semibold ${
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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

      {config && (
        <FadeIn delay={0.25}>
          <SmtpPanel
            smtp={{
              host: config.smtpHost ?? "",
              port: config.smtpPort,
              user: config.smtpUser ?? "",
              temSenha: Boolean(config.smtpPass),
            }}
          />
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
    { label: "Usuários da equipe", valor: total, icon: Users, bg: "var(--color-prospeccao-bg)", fg: "var(--color-prospeccao-fg)" },
    { label: "Administradores", valor: admins, icon: ShieldCheck, bg: "var(--color-prospeccao-bg)", fg: "var(--color-prospeccao-fg)" },
    { label: "Ativos", valor: ativos, icon: UserCheck, bg: "var(--color-cliente-bg)", fg: "var(--color-cliente-fg)" },
  ];

  return (
    <div className="card grid grid-cols-1 divide-x-0 divide-y divide-divider overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {itens.map((item) => (
        <div key={item.label} className="flex items-center gap-3 px-5 py-4">
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
            style={{ backgroundColor: item.bg, color: item.fg }}
          >
            <item.icon size={17} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <div className="text-[22px] leading-none font-extrabold tracking-tight text-text">
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
