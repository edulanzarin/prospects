import Link from "next/link";
import { UserX, ArrowLeft } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export default function ProspectNotFound() {
  return (
    <div className="flex w-full max-w-[1560px] justify-center py-10">
      <div className="card flex w-full max-w-md flex-col items-center gap-4 px-8 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-page text-text-muted">
          <UserX size={26} strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight text-ink">
            Prospect não encontrado
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
            Este prospect não existe ou foi removido do sistema.
          </p>
        </div>
        <Link href="/prospects" className={buttonClasses("primary")}>
          <ArrowLeft size={15} strokeWidth={2} />
          Voltar para a lista
        </Link>
      </div>
    </div>
  );
}
