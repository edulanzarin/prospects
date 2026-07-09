"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { atualizarPreferenciaEmail } from "@/lib/actions/conta";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function ContaForm({ receberAlertaEmail, email }: { receberAlertaEmail: boolean; email: string }) {
  const [state, formAction, pending] = useActionState(atualizarPreferenciaEmail, undefined);

  return (
    <div className="card flex h-full flex-col px-6 py-5">
      <div className="mb-1 flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-prospeccao-bg text-prospeccao-fg">
          <Mail size={15} strokeWidth={1.9} />
        </span>
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">
          Notificações por e-mail
        </h3>
      </div>
      <div className="mt-1 text-[13px] leading-relaxed text-text-secondary">
        Quando ativado, você recebe um resumo diário em <b>{email}</b> com os prospects que
        entraram em alerta.
      </div>
      <form action={formAction} className="mt-auto flex items-center gap-3 pt-4">
        <Switch
          name="receberAlertaEmail"
          defaultChecked={receberAlertaEmail}
          label="Receber e-mails de alerta"
        />
        <Button type="submit" variant="primary" disabled={pending} className="ml-auto">
          {pending ? "Salvando…" : "Salvar"}
        </Button>
      </form>
      {state && !state.ok && <div className="mt-2 text-xs text-alerta-fg">{state.error}</div>}
      {state?.ok && <div className="mt-2 text-xs text-cliente-fg">Preferência salva.</div>}
    </div>
  );
}
