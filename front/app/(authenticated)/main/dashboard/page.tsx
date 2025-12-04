import { DashboardHeader } from "./_components/header";
import {
  TotalFuncionariosCard,
  FolhasPendentesCard,
  ProximosPagamentosCard,
} from "@/app/components/dashboard";

export default function Page() {
  return (
    <>
      <div className="py-8 bg-[#F9F8FB] px-6 space-y-6">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <TotalFuncionariosCard /> */}
          <FolhasPendentesCard />
          <ProximosPagamentosCard />
        </div>
      </div>
    </>
  );
}
