"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  Calendar,
  Tag,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  UploadCloud,
  UserPlus2,
} from "lucide-react";
import { criarProspect } from "@/lib/actions/prospects";
import { ORIGEM_OPTIONS, SERVICO_OPTIONS } from "@/lib/labels";
import { formatarCNPJ, formatarTelefone } from "@/lib/mask";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";

const hoje = () => new Date().toISOString().slice(0, 10);

export function ProspectForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(criarProspect, undefined);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const inputArquivosRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.ok) router.push("/prospects");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="card flex flex-col gap-7 p-8">
      <div className="flex items-center gap-3.5 border-b border-divider pb-6">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gold text-navy">
          <UserPlus2 size={22} strokeWidth={2} />
        </span>
        <div>
          <h2 className="font-display text-[22px] font-extrabold tracking-tight text-navy">
            Novo prospect
          </h2>
          <p className="mt-0.5 text-[12.5px] text-text-muted">
            Preencha os dados abaixo · campos com * são obrigatórios
          </p>
        </div>
      </div>

      <FadeIn delay={0.05}>
        <Secao titulo="Dados da empresa" icon={<Building2 size={13} strokeWidth={2} />}>
          <Field label="Empresa *" icon={<Building2 size={14} strokeWidth={1.8} />}>
            <Input name="empresa" required placeholder="Razão social ou nome fantasia" />
          </Field>
          <Field label="CNPJ" icon={<FileText size={14} strokeWidth={1.8} />}>
            <Input
              name="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00 (se já tiver)"
              inputMode="numeric"
            />
          </Field>
        </Secao>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Secao titulo="Contato" icon={<User size={13} strokeWidth={2} />}>
          <Field label="Nome do contato *" icon={<User size={14} strokeWidth={1.8} />}>
            <Input name="contato" required placeholder="Com quem o comercial falou" />
          </Field>
          <Field label="Telefone / WhatsApp" icon={<Phone size={14} strokeWidth={1.8} />}>
            <Input
              name="telefone"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              placeholder="(47) 90000-0000"
              inputMode="numeric"
            />
          </Field>
          <Field label="E-mail" icon={<Mail size={14} strokeWidth={1.8} />}>
            <Input name="email" type="email" placeholder="contato@empresa.com.br" />
          </Field>
        </Secao>
      </FadeIn>

      <FadeIn delay={0.15}>
        <Secao titulo="Detalhes comerciais" icon={<Briefcase size={13} strokeWidth={2} />}>
          <Field label="Data do primeiro contato" icon={<Calendar size={14} strokeWidth={1.8} />}>
            <Input name="cadastro" type="date" required defaultValue={hoje()} />
          </Field>
          <Field label="Origem do contato" icon={<Tag size={14} strokeWidth={1.8} />}>
            <Select name="origem" defaultValue="INDICACAO">
              {ORIGEM_OPTIONS.map(([valor, label]) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Serviço de interesse" icon={<Briefcase size={14} strokeWidth={1.8} />}>
            <Select name="servico" defaultValue="TROCA_CONTABILIDADE">
              {SERVICO_OPTIONS.map(([valor, label]) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
        </Secao>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Secao titulo="Observações" icon={<MessageSquare size={13} strokeWidth={2} />}>
          <textarea
            name="obs"
            rows={3}
            placeholder="Resumo da conversa, o que foi combinado, próximos passos…"
            className="campo-input col-span-full resize-y"
          />
        </Secao>
      </FadeIn>

      <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-dropzone-border bg-[#FAFBFC] p-7 text-center transition-colors hover:border-gold hover:bg-dropzone-bg-hover">
        <input
          ref={inputArquivosRef}
          type="file"
          name="anexos"
          multiple
          accept="application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => setArquivos(Array.from(e.target.files ?? []))}
        />
        {arquivos.length === 0 ? (
          <>
            <UploadCloud size={24} strokeWidth={1.6} className="mx-auto mb-2 text-text-faint" />
            <div className="text-sm font-bold text-text-secondary">Anexar documentos do prospect</div>
            <div className="mt-1 text-xs text-text-faint">
              Cartão CNPJ, contrato social, propostas… · PDF, JPG, PNG
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-1.5 text-[13.5px] font-bold text-cliente-fg">
              <CheckCircle2 size={16} strokeWidth={1.8} />
              {arquivos.length} arquivo(s) selecionado(s)
            </div>
            <div className="mt-1 text-xs text-text-faint">clique para adicionar mais arquivos</div>
          </>
        )}
      </label>

      {state && !state.ok && (
        <div className="rounded-xl border border-alerta-border bg-alerta-bg px-3.5 py-2.5 text-[12.5px] text-alerta-fg">
          {state.error}
        </div>
      )}

      <div className="flex justify-end gap-2.5 border-t border-divider pt-6">
        <Button type="button" variant="outline" onClick={() => router.push("/prospects")}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Salvando…" : "Salvar prospect"}
        </Button>
      </div>
    </form>
  );
}

function Secao({
  titulo,
  icon,
  children,
}: {
  titulo: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3.5 flex items-center gap-2">
        <span className="text-text-faint">{icon}</span>
        <h3 className="text-[11.5px] font-bold tracking-wider text-text-muted uppercase">{titulo}</h3>
        <div className="h-px flex-1 bg-divider" />
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
