"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
import { atualizarStatusProspect } from "@/lib/actions/prospects";
import { buttonClasses, type ButtonVariant } from "@/components/ui/button";

export function StatusActions({ prospectId, ativo }: { prospectId: string; ativo: boolean }) {
  const [state, formAction, pending] = useActionState(atualizarStatusProspect, undefined);

  return (
    <>
      {ativo ? (
        <>
          <BotaoAcao formAction={formAction} prospectId={prospectId} acao="VIROU_CLIENTE" pending={pending} variante="sucesso">
            <Check size={14} strokeWidth={2.2} />
            Virou cliente
          </BotaoAcao>
          <BotaoAcao formAction={formAction} prospectId={prospectId} acao="NAO_FECHOU" pending={pending} variante="perigo">
            <X size={14} strokeWidth={2.2} />
            Não fechou
          </BotaoAcao>
        </>
      ) : (
        <BotaoAcao formAction={formAction} prospectId={prospectId} acao="REABRIR" pending={pending} variante="neutro">
          <RotateCcw size={14} strokeWidth={2} />
          Reabrir prospecção
        </BotaoAcao>
      )}
      <AnimatePresence>
        {state && !state.ok && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full text-xs text-alerta-fg"
          >
            {state.error}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}

function BotaoAcao({
  formAction,
  prospectId,
  acao,
  pending,
  variante,
  children,
}: {
  formAction: (formData: FormData) => void;
  prospectId: string;
  acao: "VIROU_CLIENTE" | "NAO_FECHOU" | "REABRIR";
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
    <form action={formAction} className="flex-1">
      <input type="hidden" name="prospectId" value={prospectId} />
      <input type="hidden" name="acao" value={acao} />
      <motion.button
        type="submit"
        disabled={pending}
        whileTap={{ scale: 0.96 }}
        className={buttonClasses(variantMap[variante], "md", "w-full")}
      >
        {children}
      </motion.button>
    </form>
  );
}
