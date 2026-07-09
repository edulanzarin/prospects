import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex w-full max-w-[1680px] flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card flex items-start gap-4 px-5 py-6">
            <Skeleton className="h-12 w-12 flex-none rounded-2xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-14" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-5 w-52" />
        </div>
        <Skeleton className="h-[220px] w-full rounded-xl" />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.7fr_1fr]">
        <SkeletonCard linhas={5} />
        <SkeletonCard linhas={5} />
      </div>
    </div>
  );
}
