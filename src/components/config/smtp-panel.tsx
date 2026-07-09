"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Mail, Send } from "lucide-react";
import { salvarSmtp, enviarEmailTesteSmtp } from "@/lib/actions/config";
import type { ActionResult } from "@/lib/actions/prospects";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export interface SmtpPanelProps {
  smtp: {
    host: string;
    port: number;
    user: string;
    temSenha: boolean;
  };
}

export function SmtpPanel({ smtp }: SmtpPanelProps) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState(salvarSmtp, undefined);
  const [teste, setTeste] = useState<ActionResult | undefined>(undefined);
  const [testando, iniciarTeste] = useTransition();

  useEffect(() => {
    if (state?.ok) toast("Configuração de e-mail salva.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const configurado = smtp.host.length > 0 && smtp.temSenha;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Mail size={15} strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">
            E-mail de envio (SMTP)
          </h3>
          <p className="text-[11.5px] text-text-faint">
            Conta que dispara os alertas de prospects para a equipe
          </p>
        </div>
      </div>

      <form
        action={formAction}
        className="grid grid-cols-1 gap-x-5 gap-y-4 border-t border-divider px-6 py-5 sm:grid-cols-3"
      >
        <Field label="Servidor SMTP *" className="sm:col-span-2">
          <Input
            name="host"
            required
            defaultValue={smtp.host || "smtp.gmail.com"}
            placeholder="smtp.gmail.com"
            autoComplete="off"
          />
        </Field>
        <Field label="Porta *">
          <Input name="port" type="number" required min={1} max={65535} defaultValue={smtp.port} />
        </Field>
        <Field label="E-mail de envio *" className="sm:col-span-2">
          <Input
            name="user"
            type="email"
            required
            defaultValue={smtp.user}
            placeholder="comercial@navecon.com.br"
            autoComplete="off"
          />
        </Field>
        <Field label={smtp.temSenha ? "Senha (em branco mantém a atual)" : "Senha de app *"}>
          <Input
            name="pass"
            type="password"
            required={!smtp.temSenha}
            placeholder={smtp.temSenha ? "••••••••••••" : "senha de app do Gmail"}
            autoComplete="new-password"
          />
        </Field>

        <p className="col-span-full text-xs text-text-faint">
          Para Gmail com verificação em duas etapas, use uma{" "}
          <a
            href="https://myaccount.google.com/apppasswords"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            senha de app
          </a>
          , não a senha da conta. Porta 587 (STARTTLS) é o padrão; 465 usa TLS direto.
        </p>

        {state && !state.ok && (
          <div className="col-span-full rounded-xl border border-alerta-border bg-alerta-bg px-3.5 py-2.5 text-[12.5px] text-alerta-fg">
            {state.error}
          </div>
        )}
        {teste && !teste.ok && (
          <div className="col-span-full rounded-xl border border-alerta-border bg-alerta-bg px-3.5 py-2.5 text-[12.5px] text-alerta-fg">
            {teste.error}
          </div>
        )}
        {teste?.ok && (
          <div className="col-span-full rounded-xl bg-cliente-bg px-3.5 py-2.5 text-[12.5px] text-cliente-fg">
            E-mail de teste enviado — confira a caixa de entrada.
          </div>
        )}

        <div className="col-span-full flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={testando || !configurado}
            title={
              configurado
                ? "Envia um e-mail de teste para você"
                : "Salve a configuração antes de testar"
            }
            onClick={() =>
              iniciarTeste(async () => {
                setTeste(await enviarEmailTesteSmtp());
              })
            }
          >
            <Send size={13} strokeWidth={2} />
            {testando ? "Enviando…" : "Enviar teste"}
          </Button>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
