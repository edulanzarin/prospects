"use client";

import { useActionState, useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  History,
  Send,
  UserPlus2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MessageCircle,
  ChevronDown,
  Pencil,
  Paperclip,
  Trash2,
} from "lucide-react";
import { adicionarInteracao } from "@/lib/actions/prospects";
import { formatarDataHora } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ItemTimeline {
  id: string;
  data: Date;
  texto: string;
  autor: string;
}

const VISIVEIS_INICIAL = 5;

function iconePara(texto: string) {
  if (texto.startsWith("Prospect cadastrado")) return UserPlus2;
  if (texto.startsWith("Baixa manual: virou cliente")) return CheckCircle2;
  if (texto.startsWith("Baixa manual: não fechou")) return XCircle;
  if (texto.startsWith("Prospecção reaberta")) return RotateCcw;
  if (texto.startsWith("Dados atualizados")) return Pencil;
  if (texto.startsWith("Anexo enviado")) return Paperclip;
  if (texto.startsWith("Anexo removido")) return Trash2;
  return MessageCircle;
}

export function Timeline({ prospectId, itens }: { prospectId: string; itens: ItemTimeline[] }) {
  const [state, formAction, pending] = useActionState(adicionarInteracao, undefined);
  const [expandido, setExpandido] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const visiveis = useMemo(
    () => (expandido ? itens : itens.slice(0, VISIVEIS_INICIAL)),
    [itens, expandido]
  );
  const restantes = itens.length - visiveis.length;

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-prospeccao-bg text-prospeccao-fg">
          <History size={15} strokeWidth={1.9} />
        </span>
        <h3 className="font-display text-[16px] font-bold tracking-wide text-navy">
          Histórico de contatos
        </h3>
        <span className="ml-auto rounded-full bg-page px-2 py-0.5 text-[11px] font-semibold text-text-muted">
          {itens.length}
        </span>
      </div>

      <form ref={formRef} action={formAction} className="mb-5 flex gap-2">
        <input type="hidden" name="prospectId" value={prospectId} />
        <Input
          name="texto"
          required
          placeholder="Registrar novo contato · ex: liguei, enviei proposta…"
          className="flex-1"
        />
        <Button type="submit" variant="primary-navy" disabled={pending} className="flex-none">
          <Send size={13} strokeWidth={2} />
          Registrar
        </Button>
      </form>
      {state && !state.ok && <div className="mb-3 text-xs text-alerta-fg">{state.error}</div>}

      <div
        className={`flex flex-col text-[12.5px] ${
          expandido ? "max-h-[420px] overflow-y-auto pr-1" : ""
        }`}
      >
        {visiveis.map((item, i) => {
          const Icone = iconePara(item.texto);
          const ultimo = i === visiveis.length - 1;
          return (
            <div key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!ultimo && (
                <span className="absolute left-[11px] top-[22px] bottom-0 w-px bg-divider" />
              )}
              <span
                className={`relative z-10 flex h-[23px] w-[23px] flex-none items-center justify-center rounded-full ${
                  i === 0 ? "bg-gold text-navy" : "bg-page text-text-faint"
                }`}
              >
                <Icone size={12.5} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="tabular-nums text-text-muted">{formatarDataHora(item.data)}</span>
                  <span className="text-text">{item.texto}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-text-faint">{item.autor}</div>
              </div>
            </div>
          );
        })}
      </div>

      {restantes > 0 && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpandido(true)}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-divider py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-gold hover:text-link"
        >
          <ChevronDown size={14} strokeWidth={2} />
          Mostrar mais {restantes}
        </motion.button>
      )}
      {expandido && itens.length > VISIVEIS_INICIAL && (
        <button
          type="button"
          onClick={() => setExpandido(false)}
          className="mt-2 text-center text-xs font-semibold text-link hover:text-gold"
        >
          Recolher
        </button>
      )}
    </div>
  );
}
