import Link from "next/link";
import { LoginForm } from './_components/form';
import Image from 'next/image';

export default function Login() {
  return (
    <>
      <div className="flex justify-center pt-6 md:hidden mb-8">
        <Image src="/logo.png" alt="Logo PagueAqui" width={200} height={33} />
      </div>
      
      <div className="max-w-[444px] space-y-6">
        <div className="space-y-2">
          <h1 className="text-center font-semibold text-2xl text-[#25262B]">Bem-vindo ao PagueAqui</h1>
          <p className="text-center text-sm text-[#25262B99] font-medium leading-[140%]">
            Faça login para continuar otimizando seus
            <br />
            pagamentos.
          </p>
        </div>
        
        <LoginForm />
        
        <p className="text-[#343A40] text-center text-sm font-medium">
          Ainda não possui uma conta?{" "}
          <Link
            href="/auth/hr/register"
            className="text-[#6C42F5] hover:underline"
          >
            Cadastrar
          </Link>
        </p>
      </div>
    </>
  );
}
