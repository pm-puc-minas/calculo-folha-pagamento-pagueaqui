import Image from "next/image";
import { Button } from "./button";
import { Bell } from "@phosphor-icons/react/dist/ssr";

export function PendingPage() {
  return (
    <div className="flex flex-col items-start justify-center gap-4 w-full max-w-md sm:px-4 sm:py-8 sm:mx-auto sm:text-center sm:items-center">
      <Image
        src="/pending_screen.svg"
        alt="Tela em desenvolvimento"
        className="w-32 h-32 object-contain object-center items-center"
        width={132}
        height={132}
      />
      <p className="text-[#343A40] font-semibold text-xl">Em Desenvolvimento</p>
      <p className="text-[#868E96] text-sm font-medium">
        Obrigado pelo interesse! Estamos aperfeiçoando essa funcionalidade para
        aprimorar sua experiência. Você será notificado assim que estiver
        disponível.
      </p>
      <Button className="mt-2 w-fit">
        <Bell className="size-[1.125rem] mr-2" />
        Avise-me no lançamento
      </Button>
    </div>
  );
}
