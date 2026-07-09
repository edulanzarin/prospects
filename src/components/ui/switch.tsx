import type { InputHTMLAttributes } from "react";

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & {
  label?: string;
};

/**
 * Toggle estilo iOS por cima de um checkbox real (sr-only + peer) —
 * o form continua enviando `on` como um checkbox nativo.
 */
export function Switch({ label, ...props }: SwitchProps) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-3">
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        className="relative h-[26px] w-[46px] flex-none rounded-full bg-perdido-bg ring-1 ring-inset ring-black/[0.06] transition-colors duration-200 peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-disabled:opacity-50 peer-checked:[&>span]:translate-x-5"
        aria-hidden
      >
        <span className="absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out" />
      </span>
      {label && <span className="text-[13px] text-text-secondary">{label}</span>}
    </label>
  );
}
