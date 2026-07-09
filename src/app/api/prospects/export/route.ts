import { auth } from "@/lib/auth";
import { getConfig, getProspectsFiltrados } from "@/lib/queries";
import { ORIGEM_LABELS, SERVICO_LABELS } from "@/lib/labels";
import { formatarData } from "@/lib/format";
import type { Origem } from "@/generated/prisma/enums";

function celula(valor: string) {
  // Prefixo ' impede o Excel de interpretar a célula como fórmula (=, +, -, @).
  const seguro = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
  return `"${seguro.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const sessao = await auth();
  if (!sessao?.user) return new Response("Não autorizado", { status: 401 });

  const params = new URL(request.url).searchParams;
  const status = (["TODOS", "ATIVO", "ALERTA", "CLIENTE", "PERDIDO"].includes(
    params.get("status") ?? ""
  )
    ? params.get("status")
    : "TODOS") as "TODOS" | "ATIVO" | "ALERTA" | "CLIENTE" | "PERDIDO";

  const origemParam = params.get("origem") ?? "";
  const origem: "TODAS" | Origem =
    origemParam in ORIGEM_LABELS ? (origemParam as Origem) : "TODAS";

  const config = await getConfig();
  const prospects = await getProspectsFiltrados(
    {
      busca: params.get("busca") ?? undefined,
      status,
      origem,
      cadastroDe: params.get("cadastroDe") ?? undefined,
      cadastroAte: params.get("cadastroAte") ?? undefined,
    },
    config.diasAlerta
  );

  const cabecalho = [
    "Empresa",
    "CNPJ",
    "Contato",
    "Telefone",
    "E-mail",
    "Serviço de interesse",
    "Origem",
    "Cadastro",
    "Status",
    "Baixa",
  ];
  const linhas = prospects.map((p) =>
    [
      p.empresa,
      p.cnpj ?? "",
      p.contato,
      p.telefone ?? "",
      p.email ?? "",
      SERVICO_LABELS[p.servico],
      ORIGEM_LABELS[p.origem],
      formatarData(p.cadastro),
      p.visual.label,
      p.baixa ? formatarData(p.baixa) : "",
    ]
      .map(celula)
      .join(";")
  );

  // BOM + separador ";" para abrir corretamente no Excel pt-BR.
  const csv = "﻿" + [cabecalho.map(celula).join(";"), ...linhas].join("\r\n");
  const hoje = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prospects-${hoje}.csv"`,
    },
  });
}
