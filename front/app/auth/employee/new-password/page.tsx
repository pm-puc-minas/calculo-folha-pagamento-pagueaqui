import { AsyncPageProps } from "@/app/types";
import { NewPasswordForm } from "./_components/form";
import Image from "next/image";

export default function NewPassword({ searchParams }: AsyncPageProps) {
  return (
    <>
      <div className="flex space-y-6 items-center justify-center flex-col">
        <Image
          src="/logo.png"
          alt="Logo PagueAqui"
          width={100}
          height={100}
          className="xl:hidden"
        />
        <h2 className="text-[#343A40] text-center text-xl font-semibold">
          Criar nova senha
        </h2>
        <NewPasswordForm searchParams={searchParams} />
      </div>
    </>
  );
}
