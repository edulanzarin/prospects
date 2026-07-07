import { ProspectDetailContent } from "@/components/prospects/prospect-detail-content";

export default async function ProspectDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProspectDetailContent id={id} />;
}
