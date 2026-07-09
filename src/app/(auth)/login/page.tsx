"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { authenticate } from "@/lib/actions/auth";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(authenticate, undefined);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-page px-6 py-8">
      <ThemeToggle className="absolute right-5 top-5" />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-3"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-[24px] font-semibold text-white shadow-[var(--shadow-card)]">
          N
        </span>
        <div className="text-center">
          <div className="text-[21px] font-semibold text-ink">
            Navecon
          </div>
          <div className="text-[12.5px] font-medium text-text-muted">Prospecção comercial</div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        action={formAction}
        className="card flex w-full max-w-[400px] flex-col gap-4 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
      >
        <div>
          <div className="text-[17px] font-semibold text-text">Acesso ao sistema</div>
          <div className="mt-0.5 text-[13px] text-text-muted">
            Entre com suas credenciais para continuar
          </div>
        </div>

        <Field label="E-mail">
          <Input
            type="email"
            name="email"
            required
            placeholder="voce@navecon.com.br"
            icon={<Mail size={15} strokeWidth={1.8} />}
          />
        </Field>

        <Field label="Senha">
          <div className="relative">
            <Input
              type={senhaVisivel ? "text" : "password"}
              name="senha"
              required
              placeholder="••••••••"
              icon={<Lock size={15} strokeWidth={1.8} />}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setSenhaVisivel((v) => !v)}
              aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-text-faint transition-colors hover:bg-page hover:text-text-secondary"
            >
              {senhaVisivel ? (
                <EyeOff size={15} strokeWidth={1.8} />
              ) : (
                <Eye size={15} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </Field>

        {state?.error && (
          <div className="rounded-lg border border-alerta-border bg-alerta-bg px-3 py-2 text-[12.5px] text-alerta-fg">
            {state.error}
          </div>
        )}

        <Button type="submit" variant="primary" disabled={pending} className="mt-1 w-full">
          <LogIn size={16} strokeWidth={2} />
          {pending ? "Entrando…" : "Entrar"}
        </Button>
        <div className="text-center text-[11.5px] text-text-faint">
          Acesso restrito à equipe Navecon
        </div>
      </motion.form>
      <div className="text-[11px] tracking-widest text-text-faint">CRCSC-011054/O</div>
    </div>
  );
}
