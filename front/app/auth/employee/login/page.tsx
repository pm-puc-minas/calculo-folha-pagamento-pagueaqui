import { LoginForm } from "./_components/form";

export default function Login() {
  return (
    <>
      <div className="max-w-[444px] space-y-6">
        <div className="space-y-2">
          <h1 className="text-center font-semibold text-2xl">
            Bem-vindo ao PagueAqui
          </h1>
          <p className="text-center text-sm text-[#25262B99] font-medium leading-[140%]">
            Faça login para continuar otimizando seus 
            <br />
            pagamentos.
          </p>
        </div>
        <LoginForm />
      </div>
    </>
  );
}
