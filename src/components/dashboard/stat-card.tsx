"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number;
  sublabel: string;
  icon: React.ReactNode;
  accent?: string;
  index?: number;
}

export function StatCard({ label, value, sublabel, icon, accent, index = 0 }: StatCardProps) {
  const cor = accent ?? "#041E41";
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
      whileHover={{ y: -4 }}
      className="card flex items-start gap-4 px-5 py-6 transition-shadow hover:shadow-[0_8px_18px_rgba(16,24,40,0.1),0_2px_6px_rgba(16,24,40,0.06)]"
    >
      <span
        className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl text-white"
        style={{ backgroundColor: cor }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11.5px] font-bold tracking-wide text-text-muted uppercase">
          {label}
        </div>
        <motion.div
          className="mt-1 font-display text-[38px] font-extrabold tracking-tight"
          style={{ color: cor }}
        >
          {exibido}
        </motion.div>
        <div className="mt-1.5 text-[12px] font-medium text-text-faint">{sublabel}</div>
      </div>
    </motion.div>
  );
}
