import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getConfig, getProspectsEmAlerta } from "@/lib/queries";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function AppLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const sessao = await auth();
  if (!sessao?.user) redirect("/login");

  const config = await getConfig();
  const alertas = await getProspectsEmAlerta(config.diasAlerta);

  return (
    <div className="flex h-screen">
      <Sidebar
        usuario={{ nome: sessao.user.name ?? "", papel: sessao.user.papel }}
        alertasCount={alertas.length}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar alertas={alertas} />
        <main className="flex-1 overflow-y-auto px-8 py-7">{children}</main>
      </div>
      {modal}
    </div>
  );
}
