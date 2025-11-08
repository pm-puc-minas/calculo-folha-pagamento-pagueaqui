import Link from "next/link";
import { LoginForm } from './_components/form';
import Image from 'next/image';

export default function Login() {
  return (
    <>
      <div>
        <div className="flex justify-center pt-6 md:hidden">
          <Image src="/logo.png" alt="Logo PagueAqui" width={100} height={100} />
        </div>
        <div className="flex w-full items-center justify-center p-4 md:p-8">
          <div className="max-w-[444px] space-y-6">
            <div className="space-y-2">
              <h1 className="text-center font-semibold text-2xl">Bem-vindo ao PagueAqui</h1>
              <p className="text-center text-sm text-[#25262B99] font-medium leading-[140%]">
                Faça login para continuar otimizando seus
                <br />
                pagamentos.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <LoginForm />
          <p className="text-[#343A40] text-center text-sm gap-2 font-medium">
            Ainda não possui uma conta?
            <Link href="/auth/hr/register" className="text-primary hover:underline ml-1">
              Cadastrar
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
