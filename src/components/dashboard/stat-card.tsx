"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

export type StatTone = "azul" | "vermelho" | "verde" | "cinza";

export const TONES: Record<StatTone, { bg: string; fg: string }> = {
  azul: { bg: "var(--color-prospeccao-bg)", fg: "var(--color-prospeccao-fg)" },
  vermelho: { bg: "var(--color-alerta-bg)", fg: "var(--color-alerta-fg)" },
  verde: { bg: "var(--color-cliente-bg)", fg: "var(--color-cliente-fg)" },
  cinza: { bg: "var(--color-perdido-bg)", fg: "var(--color-perdido-fg)" },
};

interface StatCardProps {
  label: string;
  value: number;
  sublabel: string;
  icon: React.ReactNode;
  tone?: StatTone;
  index?: number;
}

export function StatCard({ label, value, sublabel, icon, tone = "azul", index = 0 }: StatCardProps) {
  const cores = TONES[tone];
  const ref = useRef<HTMLDivElement>(null);
  const emVista = useInView(ref, { once: true, margin: "-40px" });
  const contador = useMotionValue(0);
  const exibido = useTransform(contador, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!emVista) return;
    const controls = animate(contador, value, { duration: 0.8, delay: index * 0.05, ease: "easeOut" });
    return () => controls.stop();
  }, [emVista, value, index, contador]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="card flex items-start gap-4 px-5 py-5 transition-shadow hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
    >
      <span
        className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
        style={{ backgroundColor: cores.bg, color: cores.fg }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
          {label}
        </div>
        <motion.div className="mt-0.5 text-[30px] font-extrabold leading-tight tracking-tight text-text">
          {exibido}
        </motion.div>
        <div className="text-[12px] font-medium text-text-faint">{sublabel}</div>
      </div>
    </motion.div>
  );
}
