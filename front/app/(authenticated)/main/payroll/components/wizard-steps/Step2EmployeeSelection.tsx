/**
 * WIZARD STEP 2: EMPLOYEE SELECTION
 * Select employees to include in this payroll
 */

'use client';

import { useState } from 'react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Skeleton } from '@/app/components/ui/skeleton';
import type { PayrollFormData, Employee } from '../../types';
import { formatCPF } from '@/app/lib/formatters';

interface Step2EmployeeSelectionProps {
  data: PayrollFormData;
  onChange: (data: Partial<PayrollFormData>) => void;
  employees?: Employee[];
  isLoadingEmployees?: boolean;
}

export function Step2EmployeeSelection({
  data,
  onChange,
  employees = [],
  isLoadingEmployees,
}: Step2EmployeeSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedIds = data.selectedEmployeeIds || [];

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      onChange({ selectedEmployeeIds: employees.map((e) => e.id!).filter(Boolean) as number[] });
    } else {
      onChange({ selectedEmployeeIds: [] });
    }
  };

  const handleToggleEmployee = (employeeId: number, checked: boolean) => {
    const currentIds = selectedIds || [];
    if (checked) {
      onChange({ selectedEmployeeIds: [...currentIds, employeeId] });
    } else {
      onChange({ selectedEmployeeIds: currentIds.filter((id) => id !== employeeId) });
    }
  };

  // Filter employees by search term
  const filteredEmployees = employees.filter((emp) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      emp.nome?.toLowerCase().includes(search) ||
      emp.sobrenome?.toLowerCase().includes(search) ||
      emp.cpf?.includes(search) ||
      emp.email?.toLowerCase().includes(search)
    );
  });

  const allSelected = filteredEmployees.length > 0 && 
    filteredEmployees.every((emp) => selectedIds.includes(emp.id!));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#212529] mb-2">
          Selecionar Colaboradores
        </h2>
        <p className="text-sm text-[#868E96]">
          Escolha os colaboradores que farão parte desta folha de pagamento.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar colaborador por nome, CPF ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-10 pr-4 border border-[#DEE2E6] rounded-lg text-sm placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-label="Buscar colaborador"
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

      {/* Select All */}
      {!isLoadingEmployees && filteredEmployees.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-[#F8F9FA] rounded-lg border border-[#DEE2E6]">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={handleToggleAll}
            aria-label="Selecionar todos os colaboradores"
          />
          <Label htmlFor="select-all" className="cursor-pointer">
            Selecionar todos ({filteredEmployees.length})
          </Label>
          <span className="ml-auto text-sm text-[#868E96]">
            {selectedIds.length} selecionado{selectedIds.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Employee List */}
      <div className="border border-[#DEE2E6] rounded-lg divide-y divide-[#DEE2E6] max-h-[400px] overflow-y-auto">
        {isLoadingEmployees ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-3">
                <Skeleton className="w-5 h-5" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#868E96]">
            {searchTerm ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador disponível'}
          </div>
        ) : (
          filteredEmployees.map((employee) => {
            const isSelected = selectedIds.includes(employee.id!);
            const fullName = `${employee.nome || ''} ${employee.sobrenome || ''}`.trim();

            return (
              <div
                key={employee.id}
                className="p-4 flex items-center gap-3 hover:bg-[#F8F9FA] transition-colors"
              >
                <Checkbox
                  id={`employee-${employee.id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handleToggleEmployee(employee.id!, checked as boolean)
                  }
                  aria-label={`Selecionar ${fullName}`}
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={`employee-${employee.id}`}
                    className="cursor-pointer font-medium text-[#212529] block truncate"
                  >
                    {fullName || 'Nome não disponível'}
                  </Label>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#868E96]">
                    {employee.cpf && <span>{formatCPF(employee.cpf)}</span>}
                    {employee.email && <span>{employee.email}</span>}
                  </div>
                </div>
                {employee.cargo && (
                  <span className="px-2 py-1 bg-[#E9ECEF] text-[#495057] text-xs rounded-full">
                    {typeof employee.cargo === 'string' ? employee.cargo : 'Cargo'}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary font-medium">
            {selectedIds.length} colaborador{selectedIds.length !== 1 ? 'es' : ''} selecionado
            {selectedIds.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-[#868E96] mt-1">
            Você poderá configurar os valores individuais nos próximos passos
          </p>
        </div>
      )}
    </div>
  );
}
