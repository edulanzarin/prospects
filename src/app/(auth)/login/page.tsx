"use client";

import { useActionState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { authenticate } from "@/lib/actions/auth";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <div className="bg-texture-navy flex min-h-screen flex-col items-center justify-center gap-2 bg-navy px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Image
          src="/logo-navecon.png"
          alt="Navecon Contabilidade e Assessoria"
          width={240}
          height={103}
          className="mb-4"
          priority
        />
      </motion.div>
      <motion.form
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        action={formAction}
        className="relative flex w-full max-w-[400px] flex-col gap-4 rounded-2xl bg-white p-9 shadow-2xl"
      >
        <div>
          <div className="font-display text-[23px] font-semibold tracking-wide text-navy">
            Acesso ao sistema
          </div>
          <div className="mt-1 text-[13px] text-text-muted">Prospecção comercial</div>
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
          <Input
            type="password"
            name="senha"
            required
            placeholder="••••••••"
            icon={<Lock size={15} strokeWidth={1.8} />}
          />
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
      <div className="relative mt-4 text-[11px] tracking-widest text-white/40">CRCSC-011054/O</div>
    </div>
  );
}
