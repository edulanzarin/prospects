"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Users, UserPlus, X } from "lucide-react";
import { criarUsuario, alternarUsuarioAtivo } from "@/lib/actions/usuarios";
import { PAPEL_LABELS, PAPEL_OPTIONS } from "@/lib/labels";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button, buttonClasses } from "@/components/ui/button";
import type { Papel } from "@/generated/prisma/enums";

interface UsuarioLinha {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
}

function iniciaisDe(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function UsuariosPanel({ usuarios }: { usuarios: UsuarioLinha[] }) {
  const [state, formAction, pending] = useActionState(criarUsuario, undefined);
  const [mostrarForm, setMostrarForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-navy/[0.08] text-navy">
          <Users size={15} strokeWidth={1.9} />
        </span>
        <h3 className="font-display text-[16px] font-bold tracking-wide text-navy">
          Usuários da equipe
        </h3>
        <button
          type="button"
          onClick={() => setMostrarForm((v) => !v)}
          className={buttonClasses("ghost", "md", "ml-auto")}
        >
          {mostrarForm ? (
            <>
              <X size={13} strokeWidth={2.2} />
              Cancelar
            </>
          ) : (
            <>
              <UserPlus size={13} strokeWidth={2.2} />
              Novo usuário
            </>
          )}
        </button>
      </div>

      {mostrarForm && (
        <form
          ref={formRef}
          action={formAction}
          className="grid grid-cols-1 gap-3 border-t border-divider px-6 py-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Input name="nome" required placeholder="Nome completo" />
          <Input name="email" type="email" required placeholder="email@navecon.com.br" />
          <Select name="papel" defaultValue="COMERCIAL">
            {PAPEL_OPTIONS.map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </Select>
          <Input
            name="senha"
            type="password"
            required
            minLength={8}
            placeholder="Senha provisória (mín. 8 caracteres)"
          />
          {state && !state.ok && (
            <div className="col-span-full text-xs text-alerta-fg">{state.error}</div>
          )}
          {state?.ok && (
            <div className="col-span-full text-xs text-cliente-fg">Usuário criado com sucesso.</div>
          )}
          <div className="col-span-full">
            <Button type="submit" variant="primary-navy" disabled={pending}>
              {pending ? "Criando…" : "Criar usuário"}
            </Button>
          </div>
        </form>
      )}

      {usuarios.map((usuario) => (
        <div
          key={usuario.id}
          className="flex items-center gap-3 border-t border-divider px-6 py-3.5"
        >
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#EDEFF3] text-xs font-bold text-navy">
            {iniciaisDe(usuario.nome)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-text">{usuario.nome}</div>
            <div className="text-[11.5px] text-text-faint">{usuario.email}</div>
          </div>
          <span className="rounded-full bg-prospeccao-bg px-2.5 py-1 text-[11px] font-semibold text-prospeccao-fg">
            {PAPEL_LABELS[usuario.papel]}
          </span>
          <ToggleAtivo usuarioId={usuario.id} ativo={usuario.ativo} />
        </div>
      ))}
    </div>
  );
}

function ToggleAtivo({ usuarioId, ativo }: { usuarioId: string; ativo: boolean }) {
  const [, formAction, pending] = useActionState(alternarUsuarioAtivo, undefined);
  return (
    <form action={formAction}>
      <input type="hidden" name="usuarioId" value={usuarioId} />
      <input type="hidden" name="ativo" value={(!ativo).toString()} />
      <button
        type="submit"
        disabled={pending}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          ativo ? "bg-cliente-bg text-cliente-fg" : "bg-perdido-bg text-perdido-fg"
        }`}
      >
        {ativo ? "Ativo" : "Inativo"}
      </button>
    </form>
  );
}
