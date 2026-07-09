import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function ProspectDetailLoading() {
  return (
    <div className="flex w-full max-w-[1560px] flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-72 max-w-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          <div className="card p-6">
            <Skeleton className="mb-5 h-5 w-44" />
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          </div>
          <SkeletonCard linhas={4} />
        </div>
        <SkeletonCard linhas={4} />
      </div>
    </div>
  );
}
