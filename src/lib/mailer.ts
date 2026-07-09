import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { diasDesde, isAlerta, limiteAlerta } from "@/lib/prospect-status";

interface SmtpResolvido {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
}

/** SMTP salvo em Configurações tem prioridade; variáveis SMTP_* são fallback. */
async function resolverSmtp(): Promise<SmtpResolvido | null> {
  const config = await prisma.config.findUnique({ where: { id: "config" } });
  if (config?.smtpHost && config.smtpUser) {
    return {
      host: config.smtpHost,
      port: config.smtpPort,
      user: config.smtpUser,
      pass: config.smtpPass ?? undefined,
      from: `Navecon Prospecção <${config.smtpUser}>`,
    };
  }

  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM ?? "Navecon Prospecção <no-reply@navecon.local>",
  };
}

function criarTransporter(smtp: SmtpResolvido) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  });
}

/** Dispara um e-mail simples para validar a configuração SMTP. Lança em caso de falha. */
export async function enviarEmailTeste(destinatario: { email: string; nome: string }) {
  const smtp = await resolverSmtp();
  if (!smtp) {
    throw new Error("SMTP não configurado.");
  }
  await criarTransporter(smtp).sendMail({
    from: smtp.from,
    to: destinatario.email,
    subject: "[Navecon] E-mail de teste",
    text: `Olá, ${destinatario.nome}!\n\nSe você recebeu esta mensagem, o envio de e-mails do sistema de prospecção está funcionando.`,
  });
}

/** Busca prospects ativos em alerta e envia um digest para cada usuário com o toggle ligado. */
export async function enviarDigestDeAlertas() {
  const smtp = await resolverSmtp();
  if (!smtp) {
    console.warn("[mailer] SMTP não configurado — digest de alertas não enviado.");
    return { enviados: 0, motivo: "smtp-nao-configurado" as const };
  }
  const transporter = criarTransporter(smtp);

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

  await Promise.all(
    destinatarios.map((destinatario) =>
      transporter.sendMail({
        from: smtp.from,
        to: destinatario.email,
        subject: `[Navecon] ${emAlerta.length} prospect(s) em alerta`,
        text: `Olá, ${destinatario.nome}!\n\nOs seguintes prospects estão em alerta:\n\n${linhas}\n\nAcesse o sistema para mais detalhes.`,
      })
    )
  );

  return { enviados: destinatarios.length, prospects: emAlerta.length };
}
