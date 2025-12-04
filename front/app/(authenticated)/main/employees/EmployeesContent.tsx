"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { UserPlusIcon, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { EmployeesTable } from "./components/EmployeesTable";
import { DeleteEmployeeDialog } from "./components/DeleteEmployeeDialog";
import {
  useEmployees,
  useCreateEmployee,
  useDeleteEmployee,
  formatError,
} from "./api";
import type { Employee } from "./types";
import { AxiosError } from "axios";

export function EmployeesContent() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // React Query hooks
  const { data: employees = [], isLoading } = useEmployees();
  const deleteMutation = useDeleteEmployee();

  const handleOpenForm = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/main/employees/register';
    }
  };

  const handleOpenDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setSelectedEmployee(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteMutation.mutateAsync(selectedEmployee.id);
      toast.success("Colaborador excluído com sucesso!");
      handleCloseDelete();
    } catch (error) {
      toast.error(
        formatError(
          error as AxiosError,
          "Erro ao excluir colaborador. Tente novamente."
        )
      );
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-[#F8F9FA]">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-[#DEE2E6]">
          <div className="flex items-center gap-2 mb-6">
            <UsersIcon className="w-5 h-5 text-[#868E96]" />
            <span className="text-2xl font-semibold text-[#212529]">
              {employees.length}
            </span>
            <span className="text-sm text-[#868E96]">
              {employees.length === 1 ? "Colaborador" : "Colaboradores"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-[#DEE2E6] rounded-lg text-sm placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]">
                <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2 border-[#DEE2E6] text-[#495057] hover:bg-[#F8F9FA]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Filtros
              </Button>
              <Button
                className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-4"
                onClick={() => handleOpenForm()}
              >
                <UserPlusIcon className="w-4 h-4" />
                Cadastrar Colaborador
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <EmployeesTable
          employees={employees}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onDelete={handleOpenDelete}
        />
      </div>

      {/* Dialog de Exclusão */}
      <DeleteEmployeeDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        employee={selectedEmployee}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
