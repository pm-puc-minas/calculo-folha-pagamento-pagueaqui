/**
 * DepartmentsContent Component
 * Main component for departments page following design specifications
 * Consumes backend API
 */

"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { toast } from "sonner";
import { DepartmentsTable } from "./components/DepartmentsTable";
import { CreateDepartmentDialog } from "./components/CreateDepartmentDialog";
import { DeleteDepartmentDialog } from "./components/DeleteDepartmentDialog";
import {
  useDepartments,
  useCreateDepartment,
  useDeleteDepartment,
  formatError,
} from "./api";
import type { Department, DepartmentFormInput } from "./types";
import { AxiosError } from "axios";

export function DepartmentsContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: departments = [], isLoading } = useDepartments();
  const createMutation = useCreateDepartment();
  const deleteMutation = useDeleteDepartment();

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleConfirmCreate = async (data: DepartmentFormInput) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Departamento criado com sucesso!");
      handleCloseCreate();
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? formatError(error as any, "Erro ao criar departamento. Tente novamente.")
        : "Erro ao criar departamento. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  const handleOpenDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setSelectedDepartment(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDepartment) return;

    try {
      await deleteMutation.mutateAsync(selectedDepartment.id);
      toast.success("Departamento excluído com sucesso!");
      handleCloseDelete();
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? formatError(error as any, "Erro ao excluir departamento. Tente novamente.")
        : "Erro ao excluir departamento. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-[#F8F9FA]">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-[#DEE2E6]">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-[#868E96]" />
            <span className="text-2xl font-semibold text-[#212529]">
              {departments.length}
            </span>
            <span className="text-sm text-[#868E96]">
              {departments.length === 1 ? "departamento" : "departamentos"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Buscar departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-[#DEE2E6] rounded-lg text-sm placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Buscar departamento"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]"
              >
                <path
                  d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Button
              className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-4 w-auto whitespace-nowrap"
              onClick={handleOpenCreate}
            >
              <Plus className="w-4 h-4" />
              Cadastrar Departamento
            </Button>
          </div>
        </div>

        {/* Table/Grid */}
        <DepartmentsTable
          departments={departments}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onDelete={handleOpenDelete}
        />
      </div>

      {/* Create Dialog */}
      <CreateDepartmentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onConfirm={handleConfirmCreate}
        isCreating={createMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteDepartmentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        department={selectedDepartment}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
