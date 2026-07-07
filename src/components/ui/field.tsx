import type { ReactNode } from "react";

export function Field({
  label,
  icon,
  className,
  children,
}: {
  label: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 text-[12.5px] font-semibold text-text-secondary ${className ?? ""}`.trim()}
    >
      <span className="flex items-center gap-1.5">
        {icon && <span className="text-text-faint">{icon}</span>}
        {label}
      </span>
      {children}
    </label>
  );
}
