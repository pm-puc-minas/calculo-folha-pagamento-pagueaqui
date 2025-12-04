/**
 * PAYROLL FILTERS COMPONENT
 * Filters for payroll listing
 */

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { X, Filter } from 'lucide-react';
import type { PayrollFilters } from '../types';

interface PayrollFiltersComponentProps {
  filters: PayrollFilters;
  onChange: (filters: PayrollFilters) => void;
  onReset: () => void;
  companies?: Array<{ id: number; razaoSocial: string }>;
}

export function PayrollFiltersComponent({
  filters,
  onChange,
  onReset,
  companies = [],
}: PayrollFiltersComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<PayrollFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
    setIsOpen(false);
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key as keyof PayrollFilters] !== undefined
  );

  // Get current month for default competencia
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`gap-2 border-[#DEE2E6] hover:bg-[#F8F9FA] ${
          hasActiveFilters ? 'border-primary text-primary' : 'text-[#495057]'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Filtros"
        aria-expanded={isOpen}
      >
        <Filter className="w-4 h-4" />
        Filtros
        {hasActiveFilters && (
          <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
            {Object.keys(filters).filter((k) => filters[k as keyof PayrollFilters]).length}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Filters Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white border border-[#DEE2E6] rounded-lg shadow-lg z-50 p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#212529]">Filtros</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#F8F9FA] rounded"
                aria-label="Fechar filtros"
              >
                <X className="w-4 h-4 text-[#868E96]" />
              </button>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-[#495057] mb-2">
                Empresa
              </label>
              <select
                value={localFilters.companyId || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    companyId: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full h-10 px-3 border border-[#DEE2E6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Filtrar por empresa"
              >
                <option value="">Todas as empresas</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.razaoSocial}
                  </option>
                ))}
              </select>
            </div>

            {/* Competencia Filter */}
            <div>
              <label className="block text-sm font-medium text-[#495057] mb-2">
                Competência (Mês/Ano)
              </label>
              <Input
                name="competencia"
                type="month"
                value={localFilters.competencia || currentMonth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLocalFilters({
                    ...localFilters,
                    competencia: e.target.value,
                  })
                }
                className="w-full"
                aria-label="Filtrar por competência"
              />
              <p className="text-xs text-[#868E96] mt-1">
                Formato: MM/AAAA
              </p>
            </div>

            {/* Status Filter - TODO: Backend doesn't support this yet */}
            <div className="opacity-50 pointer-events-none">
              <label className="block text-sm font-medium text-[#495057] mb-2">
                Status
                <span className="ml-2 text-xs text-[#868E96]">(Em breve)</span>
              </label>
              <select
                disabled
                className="w-full h-10 px-3 border border-[#DEE2E6] rounded-lg text-sm bg-[#F8F9FA]"
                aria-label="Filtrar por status (desabilitado)"
              >
                <option value="">Todos os status</option>
                <option value="DRAFT">Rascunho</option>
                <option value="PROCESSING">Em Processamento</option>
                <option value="CLOSED">Fechada</option>
                <option value="REOPENED">Reaberta</option>
              </select>
              <p className="text-xs text-[#868E96] mt-1">
                ⚠️ Backend não implementado
              </p>
            </div>

            {/* Search Term - TODO: Backend doesn't support this yet */}
            <div className="opacity-50 pointer-events-none">
              <label className="block text-sm font-medium text-[#495057] mb-2">
                Buscar
                <span className="ml-2 text-xs text-[#868E96]">(Em breve)</span>
              </label>
              <Input
                name="searchTerm"
                type="text"
                placeholder="Nome ou matrícula..."
                disabled
                className="w-full bg-[#F8F9FA]"
                aria-label="Buscar colaborador (desabilitado)"
              />
              <p className="text-xs text-[#868E96] mt-1">
                ⚠️ Backend não implementado
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-[#DEE2E6]">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                aria-label="Limpar filtros"
              >
                Limpar
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1"
                aria-label="Aplicar filtros"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
