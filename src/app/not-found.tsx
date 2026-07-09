import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-page px-6 text-center">
      <div className="text-[72px] font-semibold leading-none tracking-tight text-primary">
        404
      </div>
      <div>
        <h1 className="text-[19px] font-semibold text-text">Página não encontrada</h1>
        <p className="mt-1.5 text-[13.5px] text-text-muted">
          O endereço acessado não existe no sistema de prospecção.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
