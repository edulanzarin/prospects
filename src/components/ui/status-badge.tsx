import type { StatusVisual } from "@/lib/prospect-status";

export function StatusBadge({ status }: { status: StatusVisual }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: status.bg, color: status.fg }}
    >
      <span
        className="h-1.5 w-1.5 flex-none rounded-full"
        style={{ backgroundColor: status.fg }}
      />
      {status.label}
    </span>
  );
}
