import Image from "next/image";
import AdminCard from "./_components/adminCard";
import EmployeeCard from "./_components/employeeCard";

export default function Login() {
  return (
    <div className="flex w-dvw h-dvh bg-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <div className="w-full h-full pt-[38px] pl-6 pb-[38.297px]">
          <div className="relative w-full h-full rounded-[18px] overflow-hidden">
            <Image
              src="/mocks/LoginHR.png"
              alt="Imagem de seleção"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-between px-12 py-10">
              <Image
                src="/logo.png"
                alt="Logo PagueAqui"
                width={94}
                height={29.138}
              />
              <div className="space-y-6 max-w-[480px]">
                <h2 className="text-white text-[38px] font-semibold drop-shadow-[0_0_4px_rgba(0,0,0,0.25)]">
                  Bem-vindo ao<br />
                  PagueAqui
                </h2>
                <p className="text-white text-[18px] font-medium leading-[140%] drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] whitespace-nowrap">
                  Escolha como deseja acessar nossa plataforma
                  <br />
                  de gestão de pagamentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 flex-col space-y-4">
        <Image
          src="/logo.png"
          alt="Logo PagueAqui"
          width={200}
          height={33}
          className="xl:hidden"
        />
        <div className="max-w-[444px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-center font-semibold text-2xl">
              Escolha como deseja
              <br />
              acessar o PagueAqui
            </h1>
          </div>
          <div className="space-y-3">
            <a href="/auth/hr/login" className="block">
              <AdminCard />
            </a>
            <a href="/auth/employee/login" className="block">
              <EmployeeCard />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
