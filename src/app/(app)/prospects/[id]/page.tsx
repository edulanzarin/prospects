import { prisma } from "@/lib/prisma";
import { ProspectDetailContent } from "@/components/prospects/prospect-detail-content";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prospect = await prisma.prospect.findUnique({ where: { id }, select: { empresa: true } });
  return { title: prospect?.empresa ?? "Prospect" };
}

export default async function ProspectDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProspectDetailContent id={id} />;
}
