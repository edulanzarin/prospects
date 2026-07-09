"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Paperclip, Plus, Download, FolderOpen, Trash2, TriangleAlert } from "lucide-react";
import { enviarAnexo, excluirAnexo } from "@/lib/actions/anexos";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatarDataHora } from "@/lib/format";

interface Anexo {
  id: string;
  nomeOriginal: string;
  tamanhoBytes: number;
  criadoEm: Date;
}

function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentsList({ prospectId, anexos }: { prospectId: string; anexos: Anexo[] }) {
  const [state, formAction, pending] = useActionState(enviarAnexo, undefined);
  const [paraExcluir, setParaExcluir] = useState<Anexo | null>(null);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);
  const [excluindo, startExcluir] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.ok && inputRef.current) inputRef.current.value = "";
  }, [state]);

  function confirmarExclusao(formData: FormData) {
    setErroExclusao(null);
    startExcluir(async () => {
      const resultado = await excluirAnexo(undefined, formData);
      if (resultado.ok) setParaExcluir(null);
      else setErroExclusao(resultado.error);
    });
  }

  return (
    <div className="card p-5">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-cliente-bg text-cliente-fg">
          <FolderOpen size={15} strokeWidth={1.9} />
        </span>
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">
          Documentos anexados
        </h3>
        <label className="ml-auto flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              const arquivo = e.target.files?.[0];
              if (!arquivo) return;
              const dados = new FormData();
              dados.set("prospectId", prospectId);
              dados.set("arquivo", arquivo);
              formAction(dados);
            }}
          />
          <Plus size={13} strokeWidth={2.2} />
          {pending ? "Enviando…" : "Anexar"}
        </label>
      </div>

      {state && !state.ok && <div className="mb-2 text-xs text-alerta-fg">{state.error}</div>}

      <div className="flex flex-col gap-2">
        {anexos.map((anexo) => (
          <div
            key={anexo.id}
            className="flex items-center gap-2.5 rounded-lg border border-divider bg-hover-row px-3.5 py-2.5"
          >
            <Paperclip size={16} strokeWidth={1.6} className="flex-none text-primary" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-text">{anexo.nomeOriginal}</div>
              <div className="text-[10.5px] text-text-faint">
                {formatarTamanho(anexo.tamanhoBytes)} · {formatarDataHora(anexo.criadoEm)}
              </div>
            </div>
            <a
              href={`/api/anexos/${anexo.id}`}
              className="flex flex-none items-center gap-1 text-[11.5px] font-semibold text-primary hover:text-primary-hover"
            >
              <Download size={13} strokeWidth={2} />
              Baixar
            </a>
            <button
              type="button"
              onClick={() => setParaExcluir(anexo)}
              aria-label={`Excluir ${anexo.nomeOriginal}`}
              className="flex-none text-text-faint transition-colors hover:text-alerta-fg"
            >
              <Trash2 size={14} strokeWidth={1.8} />
            </button>
          </div>
        ))}
        {anexos.length === 0 && (
          <div className="rounded-lg border border-dashed border-dropzone-border px-4 py-5 text-center text-xs text-text-faint">
            Nenhum documento anexado ainda
          </div>
        )}
      </div>

      <Dialog
        open={!!paraExcluir}
        onClose={() => setParaExcluir(null)}
        title="Excluir anexo"
        icon={<TriangleAlert size={16} strokeWidth={1.8} />}
        widthClass="max-w-sm"
      >
        <form action={confirmarExclusao} className="flex flex-col gap-4">
          <input type="hidden" name="anexoId" value={paraExcluir?.id ?? ""} />
          <p className="text-[13px] leading-relaxed text-text-secondary">
            Excluir <b>{paraExcluir?.nomeOriginal}</b>? O arquivo é apagado definitivamente e não pode
            ser recuperado. A exclusão fica registrada no histórico do prospect.
          </p>
          {erroExclusao && <p className="text-xs text-alerta-fg">{erroExclusao}</p>}
          <div className="flex justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={() => setParaExcluir(null)}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={excluindo}>
              {excluindo ? "Excluindo…" : "Excluir"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
