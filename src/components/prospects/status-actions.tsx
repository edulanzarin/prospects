"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
import { atualizarStatusProspect } from "@/lib/actions/prospects";
import { buttonClasses, type ButtonVariant } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type Acao = "VIROU_CLIENTE" | "NAO_FECHOU" | "REABRIR";

const MENSAGEM_SUCESSO: Record<Acao, string> = {
  VIROU_CLIENTE: "Baixa registrada: o prospect virou cliente. 🎉",
  NAO_FECHOU: "Baixa registrada: o prospect não fechou.",
  REABRIR: "Prospecção reaberta.",
};

export function StatusActions({ prospectId, ativo }: { prospectId: string; ativo: boolean }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  function executar(acao: Acao) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("prospectId", prospectId);
      formData.set("acao", acao);
      const resultado = await atualizarStatusProspect(undefined, formData);
      if (resultado.ok) toast(MENSAGEM_SUCESSO[acao]);
      else toast(resultado.error, "erro");
    });
  }

  return ativo ? (
    <>
      <BotaoAcao onClick={() => executar("VIROU_CLIENTE")} pending={pending} variante="sucesso">
        <Check size={14} strokeWidth={2.2} />
        Virou cliente
      </BotaoAcao>
      <BotaoAcao onClick={() => executar("NAO_FECHOU")} pending={pending} variante="perigo">
        <X size={14} strokeWidth={2.2} />
        Não fechou
      </BotaoAcao>
    </>
  ) : (
    <BotaoAcao onClick={() => executar("REABRIR")} pending={pending} variante="neutro">
      <RotateCcw size={14} strokeWidth={2} />
      Reabrir prospecção
    </BotaoAcao>
  );
}

function BotaoAcao({
  onClick,
  pending,
  variante,
  children,
}: {
  onClick: () => void;
  pending: boolean;
  variante: "sucesso" | "perigo" | "neutro";
  children: React.ReactNode;
}) {
  const variantMap: Record<typeof variante, ButtonVariant> = {
    sucesso: "success",
    perigo: "outline-danger",
    neutro: "outline",
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={pending}
      whileTap={{ scale: 0.96 }}
      className={buttonClasses(variantMap[variante], "md", "flex-1")}
    >
      {children}
    </motion.button>
  );
}
