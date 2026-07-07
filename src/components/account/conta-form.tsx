"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { atualizarPreferenciaEmail } from "@/lib/actions/conta";
import { Button } from "@/components/ui/button";

export function ContaForm({ receberAlertaEmail, email }: { receberAlertaEmail: boolean; email: string }) {
  const [state, formAction, pending] = useActionState(atualizarPreferenciaEmail, undefined);

  return (
    <div className="card h-full px-6 py-5">
      <div className="mb-1 flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-prospeccao-bg text-prospeccao-fg">
          <Mail size={15} strokeWidth={1.9} />
        </span>
        <h3 className="font-display text-[16px] font-bold tracking-wide text-navy">
          Notificações por e-mail
        </h3>
      </div>
      <div className="mt-1 text-[13px] leading-relaxed text-text-secondary">
        Quando ativado, você recebe um resumo diário em <b>{email}</b> com os prospects que
        entraram em alerta.
      </div>
      <form action={formAction} className="mt-4 flex items-center gap-3">
        <label className="flex items-center gap-2.5 text-[13px] text-text-secondary">
          <input
            type="checkbox"
            name="receberAlertaEmail"
            defaultChecked={receberAlertaEmail}
            className="h-4 w-4 accent-gold"
          />
          Receber e-mails de alerta
        </label>
        <Button type="submit" variant="primary" disabled={pending} className="ml-auto">
          {pending ? "Salvando…" : "Salvar"}
        </Button>
      </form>
      {state && !state.ok && <div className="mt-2 text-xs text-alerta-fg">{state.error}</div>}
      {state?.ok && <div className="mt-2 text-xs text-cliente-fg">Preferência salva.</div>}
    </div>
  );
}
