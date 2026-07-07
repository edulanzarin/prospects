"use client";

import { useActionState, useEffect, useRef } from "react";
import { KeyRound } from "lucide-react";
import { trocarSenha } from "@/lib/actions/conta";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TrocarSenhaForm() {
  const [state, formAction, pending] = useActionState(trocarSenha, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="card h-full px-6 py-5">
      <div className="mb-1 flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-navy/[0.08] text-navy">
          <KeyRound size={15} strokeWidth={1.9} />
        </span>
        <h3 className="font-display text-[16px] font-bold tracking-wide text-navy">
          Alterar senha
        </h3>
      </div>
      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-3">
        <Input name="senhaAtual" type="password" required placeholder="Senha atual" />
        <Input
          name="novaSenha"
          type="password"
          required
          minLength={8}
          placeholder="Nova senha (mín. 8 caracteres)"
        />
        <Input
          name="confirmarSenha"
          type="password"
          required
          minLength={8}
          placeholder="Confirmar nova senha"
        />
        {state && !state.ok && <div className="text-xs text-alerta-fg">{state.error}</div>}
        {state?.ok && <div className="text-xs text-cliente-fg">Senha alterada com sucesso.</div>}
        <div>
          <Button type="submit" variant="primary-navy" disabled={pending}>
            {pending ? "Salvando…" : "Alterar senha"}
          </Button>
        </div>
      </form>
    </div>
  );
}
