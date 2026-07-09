import { ProspectForm } from "@/components/prospects/prospect-form";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata = { title: "Cadastrar prospect" };

export default function NovoProspectPage() {
  return (
    <div className="w-full max-w-[1680px]">
      <FadeIn>
        <ProspectForm />
      </FadeIn>
    </div>
  );
}
