import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function ConfiguracoesLoading() {
  return (
    <div className="flex w-full max-w-[1680px] flex-col gap-5">
      <div className="card flex items-center gap-4 px-7 py-6">
        <Skeleton className="h-14 w-14 flex-none rounded-2xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-56 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="hidden h-7 w-28 rounded-full sm:block" />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        <SkeletonCard linhas={4} />
        <SkeletonCard linhas={4} />
      </div>

      <SkeletonCard linhas={5} />
    </div>
  );
}
