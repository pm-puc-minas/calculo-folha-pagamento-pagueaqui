/**
 * EmployeesTable Component
 * Displays employees list with search, pagination and actions
 * Following design specifications
 */

"use client";

import { useMemo, useState } from "react";
import type { Employee } from "../types";
import { MoreVertical } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { formatDateBR } from "@/app/lib/formatters";

interface EmployeesTableProps {
  employees: Employee[];
  isLoading: boolean;
  searchTerm: string;
  onDelete: (employee: Employee) => void;
}

export function EmployeesTable({
  employees,
  isLoading,
  searchTerm,
  onDelete,
}: EmployeesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;

    const term = searchTerm.toLowerCase();
    return employees.filter((emp) => {
      const fullName = `${emp.nome} ${emp.sobrenome}`.toLowerCase();
      const email = emp.email?.toLowerCase() || "";
      const cpf = emp.cpf?.replace(/\D/g, "") || "";
      const cargoName = emp.cargo?.name?.toLowerCase() || "";
      const deptName = emp.cargo?.departamento?.nome?.toLowerCase() || "";

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        cpf.includes(term.replace(/\D/g, "")) ||
        cargoName.includes(term) ||
        deptName.includes(term)
      );
    });
  }, [employees, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(currentEmployees.map((e) => e.id).filter((id): id is number => id !== undefined)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Handle select individual
  const handleSelectOne = (id: number, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#868E96]">Carregando colaboradores...</p>
        </div>
      </div>
    );
  }

  if (currentEmployees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white">
        <img
          src="/mocks/EmptyState.png"
          alt="Nenhum colaborador encontrado"
          width={285}
          height={177}
          className="mb-6 opacity-80"
        />
      </div>
    );
  }

  // Get department badge color based on department name
  const getDepartmentColor = (deptName: string | undefined) => {
    if (!deptName) return { bg: "#E7F5FF", text: "#1971C2", border: "#A5D8FF" };
    
    const dept = deptName.toLowerCase();
    if (dept.includes("rh") || dept.includes("recursos")) return { bg: "#FFE8E8", text: "#C92A2A", border: "#FFA8A8" };
    if (dept.includes("ti") || dept.includes("tecnologia")) return { bg: "#E7F5FF", text: "#1971C2", border: "#A5D8FF" };
    if (dept.includes("marketing")) return { bg: "#F3E5FF", text: "#9C36B5", border: "#D0BFFF" };
    if (dept.includes("financeiro") || dept.includes("finance")) return { bg: "#FFF4E6", text: "#E67700", border: "#FFD8A8" };
    if (dept.includes("operações") || dept.includes("operacoes")) return { bg: "#E3FAFC", text: "#0B7285", border: "#99E9F2" };
    if (dept.includes("comercial") || dept.includes("vendas")) return { bg: "#EBF5F0", text: "#2F9E44", border: "#B2F2BB" };
    
    return { bg: "#F8F9FA", text: "#495057", border: "#DEE2E6" };
  };

  return (
    <div className="flex-1 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#DEE2E6]">
            <tr>
              <th className="px-6 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.size === currentEmployees.length && currentEmployees.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-[#CED4DA] text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
                Colaborador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
                Setor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
                Data de Admissão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {currentEmployees.map((employee) => {
              const deptColors = getDepartmentColor(employee.cargo?.departamento?.nome);
              
              return (
                <tr key={employee.id} className="hover:bg-[#F8F9FA] transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(employee.id)}
                      onChange={(e) => handleSelectOne(employee.id, e.target.checked)}
                      className="w-4 h-4 rounded border-[#CED4DA] text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {employee.nome?.charAt(0).toUpperCase()}
                          {employee.sobrenome?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-normal text-[#212529]">
                        {employee.nome} {employee.sobrenome}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#495057]">
                      {employee.cargo?.name || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border"
                      style={{
                        backgroundColor: deptColors.bg,
                        color: deptColors.text,
                        borderColor: deptColors.border,
                      }}
                    >
                      {employee.cargo?.departamento?.nome || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#D3F9D8] text-[#2B8A3E] border border-[#8CE99A]">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#495057]">
                      {employee.dataDeAdmissao ? formatDateBR(employee.dataDeAdmissao) : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#495057]">
                      {employee.email || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#868E96] hover:text-[#495057] hover:bg-[#F1F3F5] rounded"
                      onClick={() => onDelete(employee)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F3F5]">
          <p className="text-sm text-[#868E96]">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredEmployees.length)} de {filteredEmployees.length} colaboradores
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-[#DEE2E6] text-[#495057] hover:bg-[#F8F9FA]"
            >
              Anterior
            </Button>
            <span className="text-sm text-[#495057] px-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-[#DEE2E6] text-[#495057] hover:bg-[#F8F9FA]"
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
