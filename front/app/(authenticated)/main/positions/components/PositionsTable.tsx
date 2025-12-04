/**
 * PositionsTable Component
 * Displays positions list with client-side search and pagination
 * Following design specifications from Figma
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import type { Position } from "../types";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import api from "@/app/lib/axios";

interface Employee {
  id: number;
  cargo?: { id: number };
}

interface PositionsTableProps {
  positions: Position[];
  isLoading: boolean;
  searchTerm: string;
  onView: (position: Position) => void;
  onEdit: (position: Position) => void;
  onDelete: (position: Position) => void;
}

export function PositionsTable({
  positions,
  isLoading,
  searchTerm,
  onView,
  onEdit,
  onDelete,
}: PositionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debug: Log positions to see the structure
  useEffect(() => {
    if (positions.length > 0) {
      console.log("First position data:", positions[0]);
    }
  }, [positions]);

  const filteredPositions = useMemo(() => {
    if (!searchTerm.trim()) return positions;

    const term = searchTerm.toLowerCase();
    return positions.filter((position) => {
      if (!position) return false;
      const name = position.name?.toLowerCase() || "";
      const dept = position.departamento?.nome?.toLowerCase() || "";
      return name.includes(term) || dept.includes(term);
    });
  }, [positions, searchTerm]);

  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = filteredPositions.slice(startIndex, endIndex);

  // Fetch employees to count how many have each position
  const [employeeCounts, setEmployeeCounts] = useState<Record<number, number>>({});
  // Fetch departments to map position IDs to department names
  const [departmentMap, setDepartmentMap] = useState<Record<number, string>>({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees
        const { data: employees } = await api.get<Employee[]>("/funcionario/list");
        const counts: Record<number, number> = {};
        
        if (Array.isArray(employees)) {
          employees.forEach((employee) => {
            if (employee.cargo?.id) {
              const cargoId = employee.cargo.id;
              counts[cargoId] = (counts[cargoId] || 0) + 1;
            }
          });
        }
        
        setEmployeeCounts(counts);

        // Fetch departments to get position-to-department mapping
        const { data: departments } = await api.get<any[]>("/departamento/list");
        const deptMap: Record<number, string> = {};
        
        if (Array.isArray(departments)) {
          departments.forEach((dept) => {
            if (dept.cargos && Array.isArray(dept.cargos)) {
              dept.cargos.forEach((cargo: any) => {
                if (cargo.id && dept.nome) {
                  deptMap[cargo.id] = dept.nome;
                }
              });
            }
          });
        }
        
        setDepartmentMap(deptMap);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setEmployeeCounts({});
        setDepartmentMap({});
      }
    };

    fetchData();
  }, []);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Carregando cargos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Table */}
      <div className="flex-1 overflow-auto">
        {currentPositions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white">
            <Image
              src="/mocks/EmptyState.png"
              alt="Nenhum cargo encontrado"
              width={285}
              height={177}
              className="mb-6 opacity-80"
            />
          </div>
        ) : (
          <div className="p-6 bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 pb-3 mb-4 border-b border-[#DEE2E6] text-sm font-medium text-[#495057]">
              <div>Cargo</div>
              <div>Setor</div>
              <div className="text-center">Status</div>
              <div className="text-center">Vínculos</div>
              <div className="text-center">Ações</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-2">
              {currentPositions.map((position) => {
                if (!position) return null;
                // Count how many employees have this position
                const vinculos = employeeCounts[position.id] || 0;
                // TODO: Backend doesn't provide status field, assuming all active
                const status = "Ativo";

                return (
                  <div
                    key={position.id}
                    className="grid grid-cols-5 gap-4 items-center py-3 border-b border-[#DEE2E6] last:border-0"
                  >
                    {/* Position Name */}
                    <div className="text-sm text-[#212529] font-medium truncate">
                      {position.name || "N/A"}
                    </div>

                    {/* Department Badge */}
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E7E9FC] text-[#5B68DB] border border-[#D0D4F7]">
                        {position.departamento?.nome || departmentMap[position.id] || "N/A"}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          status === "Ativo"
                            ? "bg-[#D4F4DD] text-[#1B7B3F]"
                            : "bg-[#F1F3F5] text-[#495057]"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Vínculos Count */}
                    <div className="text-sm text-[#495057] text-center">
                      {vinculos}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#868E96] hover:text-primary hover:bg-primary/10"
                        onClick={() => onView(position)}
                        aria-label={`Ver cargo ${position.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {/* TODO: Edit disabled - backend has no update endpoint */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#868E96] hover:text-primary hover:bg-primary/10 opacity-50 cursor-not-allowed"
                        disabled
                        aria-label="Editar não disponível"
                        title="Editar não disponível - aguardando endpoint no backend"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#868E96] hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(position)}
                        aria-label={`Excluir cargo ${position.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#DEE2E6]">
                <p className="text-sm text-[#868E96]">
                  Mostrando {startIndex + 1} a{" "}
                  {Math.min(endIndex, filteredPositions.length)} de{" "}
                  {filteredPositions.length} cargos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-sm"
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-[#868E96]">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="text-sm"
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
