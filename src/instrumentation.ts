export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const cron = await import("node-cron");
  const { enviarDigestDeAlertas } = await import("@/lib/mailer");

  cron.schedule(
    "0 8 * * *",
    () => {
      enviarDigestDeAlertas().catch((erro) => console.error("[digest-alertas]", erro));
    },
    { timezone: "America/Sao_Paulo" }
  );
}
