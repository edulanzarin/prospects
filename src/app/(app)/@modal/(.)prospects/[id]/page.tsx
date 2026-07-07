import { Suspense } from "react";
import { Building2 } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { ProspectDetailContent } from "@/components/prospects/prospect-detail-content";

export default async function ProspectDetalheModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Drawer
      title="Detalhes do prospect"
      icon={<Building2 size={17} strokeWidth={1.8} />}
      widthClass="max-w-2xl"
    >
      <Suspense fallback={<div className="text-[13px] text-text-muted">Carregando…</div>}>
        <ProspectDetailContent id={id} emDrawer />
      </Suspense>
    </Drawer>
  );
}
