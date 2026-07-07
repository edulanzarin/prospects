import { Origem, Papel, Servico } from "@/generated/prisma/enums";

export const ORIGEM_LABELS: Record<Origem, string> = {
  INDICACAO: "Indicação",
  TELEFONE: "Telefone",
  WHATSAPP: "WhatsApp",
  SITE: "Site",
  VISITA_PRESENCIAL: "Visita presencial",
  REDES_SOCIAIS: "Redes sociais",
  OUTRO: "Outro",
};

export const SERVICO_LABELS: Record<Servico, string> = {
  TROCA_CONTABILIDADE: "Troca de contabilidade",
  ABERTURA_EMPRESA: "Abertura de empresa",
  MEI_REGULARIZACAO: "MEI / Regularização",
  FOLHA_PAGAMENTO: "Folha de pagamento",
  CONSULTORIA_FISCAL: "Consultoria fiscal",
  OUTRO: "Outro",
};

export const PAPEL_LABELS: Record<Papel, string> = {
  ADMINISTRADOR: "Administrador",
  COMERCIAL: "Comercial",
};

export const ORIGEM_OPTIONS = Object.entries(ORIGEM_LABELS) as [Origem, string][];
export const SERVICO_OPTIONS = Object.entries(SERVICO_LABELS) as [Servico, string][];
export const PAPEL_OPTIONS = Object.entries(PAPEL_LABELS) as [Papel, string][];
