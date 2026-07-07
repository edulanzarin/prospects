import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  Tag,
  Briefcase,
  CalendarClock,
  MessageSquare,
  AlertTriangle,
  AlarmClock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getConfig } from "@/lib/queries";
import { diasDesde, diasTexto, limiteAlerta, statusVisual } from "@/lib/prospect-status";
import { formatarData } from "@/lib/format";
import { ORIGEM_LABELS, SERVICO_LABELS } from "@/lib/labels";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatusActions } from "@/components/prospects/status-actions";
import { Timeline } from "@/components/prospects/timeline";
import { AttachmentsList } from "@/components/prospects/attachments-list";
import { EditProspectModal } from "@/components/prospects/edit-prospect-modal";
import { FadeIn } from "@/components/ui/fade-in";

export async function ProspectDetailContent({ id, emDrawer }: { id: string; emDrawer?: boolean }) {
  const config = await getConfig();

  const prospect = await prisma.prospect.findUnique({
    where: { id },
    include: {
      interacoes: { include: { autor: true }, orderBy: { data: "desc" } },
      anexos: { orderBy: { criadoEm: "desc" } },
      baixaPor: true,
    },
  });
  if (!prospect) notFound();

  const visual = statusVisual(prospect, config.diasAlerta);
  const ativo = prospect.status === "ATIVO";
  const baixado = !ativo;

  return (
    <div className={emDrawer ? "flex flex-col gap-5" : "flex w-full max-w-[1560px] flex-col gap-5"}>
      <div className="flex flex-col gap-3">
        {!emDrawer && (
          <Link
            href="/prospects"
            className="flex w-fit flex-none items-center gap-1.5 rounded-xl border border-input-border bg-white px-3 py-1.5 text-[12.5px] font-semibold text-text-secondary transition-colors hover:border-gold"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Voltar
          </Link>
        )}
        <div className="flex min-w-0 items-center gap-2.5">
          <h1
            title={prospect.empresa}
            className="min-w-0 truncate font-display text-[24px] font-extrabold tracking-tight text-navy"
          >
            {prospect.empresa}
          </h1>
          <span className="flex-none">
            <StatusBadge status={visual} />
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <EditProspectModal
            diasAlertaPadrao={config.diasAlerta}
            prospect={{
              id: prospect.id,
              empresa: prospect.empresa,
              cnpj: prospect.cnpj,
              contato: prospect.contato,
              telefone: prospect.telefone,
              email: prospect.email,
              origem: prospect.origem,
              servico: prospect.servico,
              obs: prospect.obs,
              diasAlertaCustom: prospect.diasAlertaCustom,
            }}
          />
          <StatusActions prospectId={prospect.id} ativo={ativo} />
        </div>
      </div>

      {visual.key === "alerta" && (
        <div className="flex items-center gap-2.5 rounded-xl border border-alerta-border bg-alerta-bg px-4 py-3 text-[13px] text-alerta-fg">
          <AlertTriangle size={16} strokeWidth={1.8} className="flex-none" />
          <span>
            <b>Alerta:</b> este prospect foi cadastrado há {diasDesde(prospect.cadastro)} dias e
            ainda não virou cliente. Faça um novo contato ou dê baixa.
          </span>
        </div>
      )}

      {baixado && (
        <div
          className="rounded-xl border px-4 py-3 text-[13px]"
          style={{
            background: prospect.status === "CLIENTE" ? "#E6F4EC" : "#EDEFF3",
            borderColor: prospect.status === "CLIENTE" ? "#BBDECB" : "#D5DAE1",
            color: visual.fg,
          }}
        >
          <b>{prospect.status === "CLIENTE" ? "Este prospect virou cliente" : "Este prospect não fechou"}</b>{" "}
          · baixa registrada em {formatarData(prospect.baixa)} por {prospect.baixaPor?.nome ?? "—"}.
        </div>
      )}

      <div
        className={
          emDrawer
            ? "flex flex-col gap-5"
            : "grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.5fr_1fr]"
        }
      >
        <FadeIn className="flex flex-col gap-5">
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Building2 size={16} strokeWidth={1.8} className="text-text-faint" />
              <h3 className="font-display text-[16px] font-bold tracking-wide text-navy">
                Dados do prospect
              </h3>
            </div>
            <div
              className={
                emDrawer
                  ? "grid grid-cols-1 gap-x-6 gap-y-4 text-[13px] sm:grid-cols-2"
                  : "grid grid-cols-1 gap-x-6 gap-y-4 text-[13px] sm:grid-cols-2 lg:grid-cols-3"
              }
            >
              <Campo label="Empresa" valor={prospect.empresa} icon={Building2} destaque />
              <Campo label="CNPJ" valor={prospect.cnpj ?? "—"} icon={FileText} />
              <Campo label="Contato" valor={prospect.contato} icon={User} />
              <Campo label="Telefone / WhatsApp" valor={prospect.telefone ?? "—"} icon={Phone} />
              <Campo label="E-mail" valor={prospect.email ?? "—"} icon={Mail} />
              <Campo label="Origem" valor={ORIGEM_LABELS[prospect.origem]} icon={Tag} />
              <Campo label="Serviço de interesse" valor={SERVICO_LABELS[prospect.servico]} icon={Briefcase} />
              <Campo
                label="Cadastro"
                valor={`${formatarData(prospect.cadastro)} · ${diasTexto(prospect)}`}
                icon={CalendarClock}
                cor={visual.fg}
                destaque
              />
              <Campo
                label="Prazo de alerta"
                valor={
                  prospect.diasAlertaCustom !== null
                    ? `${prospect.diasAlertaCustom} dias (personalizado)`
                    : `${limiteAlerta(prospect, config.diasAlerta)} dias (padrão)`
                }
                icon={AlarmClock}
              />
            </div>
            {prospect.obs && (
              <div className="mt-5 border-t border-divider pt-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-text-faint">
                  <MessageSquare size={12} strokeWidth={2} />
                  Observações
                </div>
                <div className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{prospect.obs}</div>
              </div>
            )}
          </div>

          <Timeline
            prospectId={prospect.id}
            itens={prospect.interacoes.map((i) => ({
              id: i.id,
              data: i.data,
              texto: i.texto,
              autor: i.autor.nome,
            }))}
          />
        </FadeIn>

        <FadeIn delay={0.08} className="flex flex-col gap-4">
          <AttachmentsList prospectId={prospect.id} anexos={prospect.anexos} />
        </FadeIn>
      </div>
    </div>
  );
}

function Campo({
  label,
  valor,
  icon: Icon,
  cor,
  destaque,
}: {
  label: string;
  valor: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  cor?: string;
  destaque?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-text-faint">
        <Icon size={12} strokeWidth={2} />
        {label}
      </div>
      <div
        className={`mt-1 truncate ${destaque ? "font-bold" : ""}`}
        title={valor}
        style={{ color: cor ?? "#1A2433" }}
      >
        {valor}
      </div>
    </div>
  );
}
