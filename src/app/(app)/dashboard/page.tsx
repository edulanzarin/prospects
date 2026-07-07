import { Users, AlertTriangle, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getConfig, getProspectsEmAlerta, getSerieCadastrosMesAtual } from "@/lib/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { AlertaPanel } from "@/components/dashboard/alerta-panel";
import { RecentesPanel } from "@/components/dashboard/recentes-panel";
import { ProspectsChart } from "@/components/dashboard/prospects-chart";
import { FadeIn } from "@/components/ui/fade-in";

export default async function DashboardPage() {
  const config = await getConfig();

  const [ativosCount, clientesCount, perdidosCount, alertasIds, recentes, serie] = await Promise.all([
    prisma.prospect.count({ where: { status: "ATIVO" } }),
    prisma.prospect.count({ where: { status: "CLIENTE" } }),
    prisma.prospect.count({ where: { status: "PERDIDO" } }),
    getProspectsEmAlerta(config.diasAlerta),
    prisma.prospect.findMany({ orderBy: { criadoEm: "desc" }, take: 5 }),
    getSerieCadastrosMesAtual(),
  ]);

  const alertasDetalhados = await prisma.prospect.findMany({
    where: { id: { in: alertasIds.slice(0, 5).map((p) => p.id) } },
    orderBy: { cadastro: "asc" },
  });

  const nomeMes = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date())
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex w-full max-w-[1680px] flex-col gap-6">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          label="Em prospecção"
          value={ativosCount}
          sublabel="aguardando definição"
          icon={<Users size={19} strokeWidth={1.8} />}
          accent="#041E41"
          index={0}
        />
        <StatCard
          label="Em alerta"
          value={alertasIds.length}
          sublabel="acima do prazo de cada prospect"
          icon={<AlertTriangle size={19} strokeWidth={1.8} />}
          accent="#C0392B"
          index={1}
        />
        <StatCard
          label="Viraram clientes"
          value={clientesCount}
          sublabel="conversões registradas"
          icon={<CheckCircle2 size={19} strokeWidth={1.8} />}
          accent="#1E7E4C"
          index={2}
        />
        <StatCard
          label="Não fecharam"
          value={perdidosCount}
          sublabel="baixas sem conversão"
          icon={<XCircle size={19} strokeWidth={1.8} />}
          accent="#667085"
          index={3}
        />
      </div>

      <FadeIn delay={0.1} className="card p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-prospeccao-bg text-prospeccao-fg">
            <TrendingUp size={15} strokeWidth={1.9} />
          </span>
          <h3 className="font-display text-[16px] font-bold tracking-wide text-navy">
            Cadastros e conversões
          </h3>
          <span className="rounded-full bg-page px-2.5 py-1 text-[11px] font-bold text-text-muted uppercase">
            {nomeMes}
          </span>
        </div>
        <ProspectsChart dados={serie} />
      </FadeIn>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.7fr_1fr]">
        <FadeIn delay={0.15}>
          <AlertaPanel prospects={alertasDetalhados} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <RecentesPanel diasAlerta={config.diasAlerta} prospects={recentes} />
        </FadeIn>
      </div>
    </div>
  );
}
