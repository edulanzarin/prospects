import { Skeleton } from "@/components/ui/skeleton";

export default function NovoProspectLoading() {
  return (
    <div className="w-full max-w-[1680px]">
      <div className="card flex flex-col gap-7 p-8">
        <div className="flex items-center gap-3.5 border-b border-divider pb-6">
          <Skeleton className="h-12 w-12 flex-none rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-3.5 w-64" />
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, secao) => (
          <div key={secao}>
            <Skeleton className="mb-4 h-3.5 w-36" />
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}
