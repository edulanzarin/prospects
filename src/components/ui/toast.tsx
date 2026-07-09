"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastTipo = "sucesso" | "erro";

interface ToastItem {
  id: number;
  mensagem: string;
  tipo: ToastTipo;
}

const ToastContext = createContext<(mensagem: string, tipo?: ToastTipo) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const DURACAO_MS = 4200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const proximoId = useRef(0);

  const remover = useCallback((id: number) => {
    setToasts((atual) => atual.filter((t) => t.id !== id));
  }, []);

  const exibir = useCallback(
    (mensagem: string, tipo: ToastTipo = "sucesso") => {
      const id = proximoId.current++;
      setToasts((atual) => [...atual.slice(-2), { id, mensagem, tipo }]);
      setTimeout(() => remover(id), DURACAO_MS);
    },
    [remover]
  );

  return (
    <ToastContext.Provider value={exibir}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-[360px] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto flex items-start gap-2.5 rounded-2xl border border-black/[0.06] bg-card px-4 py-3 shadow-[0_8px_24px_rgba(16,24,40,0.14),0_2px_6px_rgba(16,24,40,0.08)]"
              role="status"
            >
              {toast.tipo === "sucesso" ? (
                <CheckCircle2 size={17} strokeWidth={2} className="mt-px flex-none text-cliente-fg" />
              ) : (
                <AlertCircle size={17} strokeWidth={2} className="mt-px flex-none text-alerta-fg" />
              )}
              <span className="flex-1 text-[13px] font-medium leading-snug text-text">
                {toast.mensagem}
              </span>
              <button
                type="button"
                onClick={() => remover(toast.id)}
                aria-label="Fechar aviso"
                className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-text-faint transition-colors hover:bg-page hover:text-text"
              >
                <X size={13} strokeWidth={2.2} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
