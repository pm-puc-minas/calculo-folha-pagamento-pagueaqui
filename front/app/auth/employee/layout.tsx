import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <div className="flex w-dvw h-dvh bg-white">
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <div className="w-full h-full pt-[38px] pl-6 pb-[38.297px]">
            <div className="relative w-full h-full rounded-[18px] overflow-hidden">
              <Image
                src="/mocks/LoginEmployee.png"
                alt="Imagem de funcionário"
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
                  <h2 className="text-white text-[38px] font-semibold leading-normal drop-shadow-[0_0_4px_rgba(0,0,0,0.25)]">
                    Transparência e confiança<br />
                    Tudo o que você precisa<br />
                    em um só lugar.
                  </h2>
                  <p className="text-white text-[18px] font-medium leading-[140%] drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] whitespace-nowrap">
                    No PagueAqui, você tem acesso a seus pagamentos, 
                    <br />
                    benefícios e registros de forma simples e clara.
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
          {children}
        </div>
      </div>
    </>
  );
}
