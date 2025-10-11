import AdminCard from "./_components/adminCard";
import EmployeeCard from "./_components/employeeCard";

export default function Login() {
  return (
    <div>
      <div className="flex w-full items-center justify-center p-4 md:p-8">
        <div className="max-w-[444px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-center font-semibold text-2xl">
              Escolha como deseja
              <br />
              acessar o PagueAqui
            </h1>
          </div>
        </div>
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
  );
}
