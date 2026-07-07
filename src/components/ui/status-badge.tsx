import type { StatusVisual } from "@/lib/prospect-status";

export function StatusBadge({ status }: { status: StatusVisual }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: status.bg, color: status.fg }}
    >
      {status.label}
    </span>
  );
}
