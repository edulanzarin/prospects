"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full max-w-[1680px] justify-center py-10">
      <div className="card flex w-full max-w-md flex-col items-center gap-4 px-8 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-alerta-bg text-alerta-fg">
          <AlertOctagon size={26} strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight text-ink">
            Algo deu errado
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
            Ocorreu um erro inesperado ao carregar esta tela. Tente novamente — se o problema
            persistir, avise o suporte.
          </p>
          {error.digest && (
            <p className="mt-2 text-[11px] tracking-wide text-text-faint">
              Código do erro: {error.digest}
            </p>
          )}
        </div>
        <Button type="button" variant="primary" onClick={() => unstable_retry()}>
          <RotateCcw size={15} strokeWidth={2} />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
