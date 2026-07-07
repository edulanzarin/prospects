"use client";

import { useState, useTransition } from "react";
import {
  Pencil,
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  Tag,
  Briefcase,
  MessageSquare,
  AlarmClock,
} from "lucide-react";
import { atualizarProspect } from "@/lib/actions/prospects";
import { ORIGEM_OPTIONS, SERVICO_OPTIONS } from "@/lib/labels";
import { formatarCNPJ, formatarTelefone } from "@/lib/mask";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Origem, Servico } from "@/generated/prisma/enums";

interface ProspectEditavel {
  id: string;
  empresa: string;
  cnpj: string | null;
  contato: string;
  telefone: string | null;
  email: string | null;
  origem: Origem;
  servico: Servico;
  obs: string | null;
  diasAlertaCustom: number | null;
}

export function EditProspectModal({
  prospect,
  diasAlertaPadrao,
}: {
  prospect: ProspectEditavel;
  diasAlertaPadrao: number;
}) {
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [cnpj, setCnpj] = useState(prospect.cnpj ?? "");
  const [telefone, setTelefone] = useState(prospect.telefone ?? "");

  function salvar(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const resultado = await atualizarProspect(undefined, formData);
      if (resultado.ok) setAberto(false);
      else setErro(resultado.error);
    });
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setAberto(true)} className="flex-1">
        <Pencil size={14} strokeWidth={2} />
        Editar
      </Button>

      <Dialog
        open={aberto}
        onClose={() => setAberto(false)}
        title="Editar prospect"
        subtitle="As alterações ficam registradas no histórico de contatos"
        icon={<Pencil size={16} strokeWidth={1.8} />}
        widthClass="max-w-2xl"
      >
        <form action={salvar} className="flex flex-col gap-5">
          <input type="hidden" name="prospectId" value={prospect.id} />
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field label="Empresa *" icon={<Building2 size={14} strokeWidth={1.8} />}>
              <Input name="empresa" required defaultValue={prospect.empresa} />
            </Field>
            <Field label="CNPJ" icon={<FileText size={14} strokeWidth={1.8} />}>
              <Input
                name="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
                inputMode="numeric"
              />
            </Field>
            <Field label="Nome do contato *" icon={<User size={14} strokeWidth={1.8} />}>
              <Input name="contato" required defaultValue={prospect.contato} />
            </Field>
            <Field label="Telefone / WhatsApp" icon={<Phone size={14} strokeWidth={1.8} />}>
              <Input
                name="telefone"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                inputMode="numeric"
              />
            </Field>
            <Field label="E-mail" icon={<Mail size={14} strokeWidth={1.8} />}>
              <Input name="email" type="email" defaultValue={prospect.email ?? ""} />
            </Field>
            <Field label="Origem do contato" icon={<Tag size={14} strokeWidth={1.8} />}>
              <Select name="origem" defaultValue={prospect.origem}>
                {ORIGEM_OPTIONS.map(([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Serviço de interesse" icon={<Briefcase size={14} strokeWidth={1.8} />}>
              <Select name="servico" defaultValue={prospect.servico}>
                {SERVICO_OPTIONS.map(([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Prazo de alerta (dias)" icon={<AlarmClock size={14} strokeWidth={1.8} />}>
              <Input
                name="diasAlertaCustom"
                type="number"
                min={1}
                max={365}
                placeholder={`Padrão do sistema (${diasAlertaPadrao} dias)`}
                defaultValue={prospect.diasAlertaCustom ?? ""}
              />
            </Field>
            <Field
              label="Observações"
              icon={<MessageSquare size={14} strokeWidth={1.8} />}
              className="col-span-full"
            >
              <textarea
                name="obs"
                rows={3}
                defaultValue={prospect.obs ?? ""}
                className="campo-input resize-y"
              />
            </Field>
          </div>
          <p className="-mt-2 text-[11.5px] text-text-faint">
            Deixe em branco para usar o prazo padrão do sistema ({diasAlertaPadrao} dias, definido em
            Configurações).
          </p>

          {erro && (
            <div className="rounded-lg border border-alerta-border bg-alerta-bg px-3.5 py-2.5 text-[12.5px] text-alerta-fg">
              {erro}
            </div>
          )}

          <div className="flex justify-end gap-2.5 border-t border-divider pt-4">
            <Button type="button" variant="outline" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Salvando…" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
