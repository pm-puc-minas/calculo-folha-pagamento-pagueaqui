import Image from 'next/image';
import { RegisterForm } from './_components/form';
import Link from 'next/link';

export default function Register() {
  return (
    <>
      <div className="flex flex-col gap-7">
        <div className="flex justify-center pt-6 md:hidden">
          <Image src="/logo.png" alt="Logo PagueAqui" width={100} height={100} />
        </div>
        <div className="space-y-2">
          <h1 className="text-[#343A40] text-center text-2xl font-semibold">
            Crie sua conta no PagueAqui
          </h1>
          <p className="text-[#909296] text-center text-sm font-medium">
            Dê o primeiro passo para transformar <br /> a gestão de Folhas de Pagamento.
          </p>
        </div>
        <RegisterForm />
        <div className="text-[#343A40] text-sm font-medium text-balance text-center">
          <p>Ao continuar, você concorda com os</p>
          <div className="flex gap-1">
            <Link target="_blank" href="#" className="text-primary font-semibold">
              Termos de serviço
            </Link>
            e
            <Link target="_blank" href="#" className="text-primary font-semibold">
              Políticas de privacidade <p className="text-[#343A40] ">.</p>
            </Link>
          </div>
        </div>
        <p className="text-[#343A40] text-sm font-medium text-center">
          Já possui uma conta?
          <a className="text-[#4000FE] ml-1 hover:underline font-semibold" href="/auth/hr/login">
            Fazer login
          </a>
        </p>
      </div>
    </>
  );
}
