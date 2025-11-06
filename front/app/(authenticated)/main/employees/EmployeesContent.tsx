"use client";

import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { UserPlusIcon, Users as UsersIcon, CheckCircle2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function EmployeesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace("/main/employees");
      }, 5000);
    }
  }, [searchParams, router]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-start gap-3 max-w-md animate-in slide-in-from-top-5">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 text-sm mb-1">
              Colaborador adicionado com sucesso
            </h3>
            <p className="text-xs text-green-700">
              O convite foi enviado para o e-mail do colaborador.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
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
