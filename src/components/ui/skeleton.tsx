export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-ink/[0.06] ${className ?? ""}`.trim()} />;
}

/** Card com linhas de skeleton — bloco genérico para telas de loading. */
export function SkeletonCard({
  linhas = 3,
  className,
}: {
  linhas?: number;
  className?: string;
}) {
  return (
    <div className={`card flex flex-col gap-3 p-6 ${className ?? ""}`.trim()}>
      <Skeleton className="h-5 w-44" />
      {Array.from({ length: linhas }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i % 2 === 0 ? "w-full" : "w-3/4"}`} />
      ))}
    </div>
  );
}
