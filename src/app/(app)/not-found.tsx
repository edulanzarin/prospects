import Link from "next/link";
import { SearchX, LayoutDashboard } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export default function AppNotFound() {
  return (
    <div className="flex w-full max-w-[1680px] justify-center py-10">
      <div className="card flex w-full max-w-md flex-col items-center gap-4 px-8 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-page text-text-muted">
          <SearchX size={26} strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight text-ink">
            Página não encontrada
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
            O endereço acessado não existe ou o registro pode ter sido removido.
          </p>
        </div>
        <Link href="/dashboard" className={buttonClasses("primary")}>
          <LayoutDashboard size={15} strokeWidth={2} />
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  );
}
