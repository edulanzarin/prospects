import { Skeleton } from "@/components/ui/skeleton";

export default function ProspectsLoading() {
  return (
    <div className="flex w-full max-w-[1680px] flex-col gap-4">
      <div className="card flex flex-wrap items-center gap-3 px-5 py-4">
        <Skeleton className="h-10 w-full max-w-[420px] flex-1 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-56 rounded-xl" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-4 border-b border-divider px-5 py-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-24" />
          ))}
          <Skeleton className="ml-auto h-7 w-28 rounded-xl" />
        </div>
        <div className="border-b border-divider bg-hover-row px-5 py-4">
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-divider px-5 py-4 last:border-b-0"
          >
            <div className="flex w-1/4 flex-col gap-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="ml-auto h-6 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
