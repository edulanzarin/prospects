"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { OverlayCloseContext } from "@/components/ui/overlay-context";

interface DrawerProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  widthClass?: string;
  children: React.ReactNode;
}

export function Drawer({ title, subtitle, icon, widthClass = "max-w-xl", children }: DrawerProps) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const close = useCallback(() => setClosing(true), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [close]);

  return (
    <OverlayCloseContext.Provider value={close}>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: closing ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        />
        <motion.div
          className={`relative flex h-full w-full ${widthClass} flex-col border-l border-card-border bg-page shadow-[var(--shadow-float)]`}
          initial={{ x: "100%" }}
          animate={{ x: closing ? "100%" : 0 }}
          transition={{ type: "spring", damping: 32, stiffness: 320 }}
          onAnimationComplete={() => {
            if (closing) router.back();
          }}
        >
          <div className="flex flex-none items-center gap-3 border-b border-divider bg-card px-6 py-4">
            {icon && (
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary-soft text-primary">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-semibold tracking-tight text-ink">
                {title}
              </h2>
              {subtitle && <p className="mt-0.5 text-[12.5px] text-text-muted">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="ml-auto flex h-8 w-8 flex-none items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary-soft hover:text-text"
            >
              <X size={18} strokeWidth={1.8} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </motion.div>
      </div>
    </OverlayCloseContext.Provider>
  );
}
