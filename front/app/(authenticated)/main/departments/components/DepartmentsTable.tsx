/**
 * DepartmentsTable Component
 * Displays departments list with client-side search and pagination
 */

"use client";

import { useMemo, useState } from "react";
import type { Department } from "../types";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";

interface DepartmentsTableProps {
  departments: Department[];
  isLoading: boolean;
  searchTerm: string;
  onDelete: (department: Department) => void;
}

export function DepartmentsTable({
  departments,
  isLoading,
  searchTerm,
  onDelete,
}: DepartmentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments;

    const term = searchTerm.toLowerCase();
    return departments.filter((dept) => {
      const nome = dept.nome?.toLowerCase() || "";
      return nome.includes(term);
    });
  }, [departments, searchTerm]);

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDepartments = filteredDepartments.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Carregando departamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Table */}
      <div className="flex-1 overflow-auto">
        {currentDepartments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white">
            <Image
              src="/mocks/EmptyState.png"
              alt="Nenhum departamento encontrado"
              width={285}
              height={177}
              className="mb-6 opacity-80"
            />
            <p className="text-[#495057] font-medium mb-1">
              {searchTerm
                ? "Nenhum departamento encontrado"
                : "Não há registros..."}
            </p>
            <p className="text-sm text-[#ADB5BD]">
              {searchTerm
                ? "Tente ajustar os filtros de busca"
                : "Aqui serão listados os departamentos da empresa"}
            </p>
          </div>
        ) : (
          <div className="p-6 bg-white">
            {/* Department Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentDepartments.map((department) => {
                const memberCount = department.cargos?.length || 0;

                return (
                  <div
                    key={department.id}
                    className="bg-white rounded-lg border border-[#DEE2E6] p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header with action button */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#212529] flex-1">
                        {department.nome}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#868E96] hover:text-red-600 hover:bg-red-50 -mt-1 -mr-1"
                        onClick={() => onDelete(department)}
                        aria-label={`Excluir departamento ${department.nome}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Member count */}
                    <div className="flex items-center gap-2 text-sm text-[#868E96]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-[#868E96]"
                      >
                        <path
                          d="M11 7a2 2 0 100-4 2 2 0 000 4zM13.666 10c0-1.333-1.333-2-3.333-2s-3.333.667-3.333 2v1.333h6.666V10zM5 7a2 2 0 100-4 2 2 0 000 4zM7.666 10c0-.4.067-.773.2-1.12-.44-.053-.9-.08-1.366-.08-2 0-3.333.667-3.333 2v1.333h4.5V10z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>
                        {memberCount}{" "}
                        {memberCount === 1 ? "Membro" : "Membros"}
                      </span>
                    </div>

                    {department.cargos && department.cargos.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#DEE2E6]">
                        <p className="text-xs text-[#868E96] mb-2">Cargos:</p>
                        <div className="flex flex-wrap gap-1">
                          {department.cargos.slice(0, 3).map((cargo) => (
                            <span
                              key={cargo.id}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-[#F1F3F5] text-[#495057]"
                            >
                              {cargo.name}
                            </span>
                          ))}
                          {department.cargos.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-[#F1F3F5] text-[#495057]">
                              +{department.cargos.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Mostrando {startIndex + 1} a{" "}
                  {Math.min(endIndex, filteredDepartments.length)} de{" "}
                  {filteredDepartments.length} departamentos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
