import Image from "next/image";
import { ForgotPasswordForm } from "./_components/form";

export default function ForgotMyPassword() {
  return (
    <>
      <div className="space-y-6 text-center flex items-center flex-col">
        <Image
          src="/logo.png"
          alt="Logo PagueAqui"
          width={100}
          height={100}
          className="xl:hidden"
        />
        <div className="space-y-2">
          <h2 className="text-[#343A40] text-xl text-balance font-semibold">
            Esqueceu sua senha?
          </h2>
          <p className="text-[#909296] text-balance text-sm font-medium">
            Confirme seu e-mail abaixo e enviaremos as <br />
            instruções para redefinir.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </>
  );
}
