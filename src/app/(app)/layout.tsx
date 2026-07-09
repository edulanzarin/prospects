import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getConfig, getProspectsEmAlerta } from "@/lib/queries";
import { AppShell } from "@/components/layout/app-shell";
import { ToastProvider } from "@/components/ui/toast";

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
    <ToastProvider>
      <AppShell
        usuario={{ nome: sessao.user.name ?? "", papel: sessao.user.papel }}
        alertas={alertas}
      >
        {children}
      </AppShell>
      {modal}
    </ToastProvider>
  );
}
