import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { diasDesde, isAlerta, limiteAlerta } from "@/lib/prospect-status";

function criarTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

/** Busca prospects ativos em alerta e envia um digest para cada usuário com o toggle ligado. */
export async function enviarDigestDeAlertas() {
  const transporter = criarTransporter();
  if (!transporter) {
    console.warn("[mailer] SMTP_HOST não configurado — digest de alertas não enviado.");
    return { enviados: 0, motivo: "smtp-nao-configurado" as const };
  }

  const config = await prisma.config.findUnique({ where: { id: "config" } });
  const diasAlerta = config?.diasAlerta ?? 15;

  const ativos = await prisma.prospect.findMany({
    where: { status: "ATIVO" },
    orderBy: { cadastro: "asc" },
  });
  const emAlerta = ativos.filter((p) => isAlerta(p, diasAlerta));

  if (emAlerta.length === 0) {
    return { enviados: 0, motivo: "sem-alertas" as const };
  }

  const destinatarios = await prisma.usuario.findMany({
    where: { ativo: true, receberAlertaEmail: true },
    select: { email: true, nome: true },
  });

  const linhas = emAlerta
    .map(
      (p) =>
        `- ${p.empresa} (${p.contato}) · ${diasDesde(p.cadastro)} dias sem virar cliente (prazo: ${limiteAlerta(p, diasAlerta)} dias)`
    )
    .join("\n");

  const from = process.env.SMTP_FROM ?? "Navecon Prospecção <no-reply@navecon.local>";

  await Promise.all(
    destinatarios.map((destinatario) =>
      transporter.sendMail({
        from,
        to: destinatario.email,
        subject: `[Navecon] ${emAlerta.length} prospect(s) em alerta`,
        text: `Olá, ${destinatario.nome}!\n\nOs seguintes prospects estão em alerta:\n\n${linhas}\n\nAcesse o sistema para mais detalhes.`,
      })
    )
  );

  return { enviados: destinatarios.length, prospects: emAlerta.length };
}
