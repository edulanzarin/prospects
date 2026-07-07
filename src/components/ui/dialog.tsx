"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  widthClass?: string;
  children: React.ReactNode;
}

/** Modal controlado por estado local — para ações pontuais (editar, confirmar), sem envolver rota. */
export function Dialog({ open, onClose, title, subtitle, icon, widthClass = "max-w-lg", children }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className={`relative flex max-h-[88vh] w-full ${widthClass} flex-col overflow-hidden rounded-2xl bg-page shadow-2xl`}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex flex-none items-center gap-3 border-b border-divider bg-white px-6 py-5">
              {icon && (
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-page text-navy">
                  {icon}
                </span>
              )}
              <div className="min-w-0">
                <h2 className="truncate font-display text-[17px] font-semibold tracking-wide text-navy">
                  {title}
                </h2>
                {subtitle && <p className="mt-0.5 text-[12.5px] text-text-muted">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="ml-auto flex h-8 w-8 flex-none items-center justify-center rounded-full text-text-muted transition-colors hover:bg-page hover:text-text"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
