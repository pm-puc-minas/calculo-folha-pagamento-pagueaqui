"use client";

import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { UserPlusIcon, Users as UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmployeesContent() {
  const router = useRouter();
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <UsersIcon className="w-5 h-5 text-gray-500" />
          <span className="text-2xl font-semibold text-gray-900">0</span>
          <span className="text-sm text-gray-500">Colaboradores</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative" />
          <div className="flex items-center gap-3">
            <Button
              className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-4"
              onClick={() => router.push("/main/employees/register")}
            >
              <UserPlusIcon className="w-4 h-4" />
              Cadastrar colaborador
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-background overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md px-4">
            <Image
              src="/mocks/EmptyState.png"
              alt="Nenhum colaborador cadastrado"
              width={285}
              height={177}
              className="mx-auto mb-6 opacity-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
