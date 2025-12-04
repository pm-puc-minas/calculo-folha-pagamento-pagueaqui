/**
 * PAYROLL PAGE CONTENT (Client Component)
 * Main page for listing and managing payrolls
 */

'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PayrollTable } from './components/PayrollTable';
import { PayrollFiltersComponent } from './components/PayrollFilters';
import { useFilteredPayrolls, formatError } from './api';
import type { PayrollFilters } from './types';
import type { FolhaPagamentoModel } from '@/app/lib/api/generated/hRPayrollAPI.schemas';

export function PayrollContent() {
  const router = useRouter();
  const [filters, setFilters] = useState<PayrollFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch payrolls with client-side filtering
  const { data: payrolls = [], isLoading, error } = useFilteredPayrolls(filters);

  // TODO: Fetch companies for filter dropdown
  // For now, extract unique companies from payrolls
  const companies = Array.from(
    new Map(
      (payrolls as FolhaPagamentoModel[])
        .map((p) => p.company)
        .filter(Boolean)
        .map((c) => [c.id, c])
    ).values()
  ).filter((c) => c !== undefined && c.id !== undefined) as Array<{ id: number; razaoSocial: string; nomeFantasia?: string }>;

  const handleCreatePayroll = () => {
    // Navigate to wizard
    router.push('/main/payroll/create');
  };

  const handleViewHolerites = (payroll: FolhaPagamentoModel) => {
    // TODO: Backend needs holerite endpoint
    toast.error('Visualização de holerites ainda não disponível (backend pendente)');
    console.warn('HOLERITE_NOT_IMPLEMENTED:', payroll.id);
  };

  const handleEdit = (payroll: FolhaPagamentoModel) => {
    // TODO: Backend needs update endpoint
    toast.error('Edição ainda não disponível (backend pendente)');
    console.warn('UPDATE_NOT_IMPLEMENTED:', payroll.id);
  };

  const handleDelete = (payroll: FolhaPagamentoModel) => {
    // TODO: Backend needs delete endpoint
    toast.error('Exclusão ainda não disponível (backend pendente)');
    console.warn('DELETE_NOT_IMPLEMENTED:', payroll.id);
  };

  const handleClose = (payroll: FolhaPagamentoModel) => {
    // TODO: Backend needs close workflow
    toast.error('Fechamento de folha ainda não disponível (backend pendente)');
    console.warn('CLOSE_NOT_IMPLEMENTED:', payroll.id);
  };

  const handleReopen = (payroll: FolhaPagamentoModel) => {
    // TODO: Backend needs reopen workflow
    toast.error('Reabertura de folha ainda não disponível (backend pendente)');
    console.warn('REOPEN_NOT_IMPLEMENTED:', payroll.id);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  // Apply search filter (client-side)
  const filteredPayrolls = searchTerm
    ? (payrolls as FolhaPagamentoModel[]).filter((p) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          p.company?.razaoSocial?.toLowerCase().includes(searchLower) ||
          p.company?.nomeFantasia?.toLowerCase().includes(searchLower) ||
          p.observacoes?.toLowerCase().includes(searchLower)
        );
      })
    : payrolls;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA]">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-[#DEE2E6]">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-[#868E96]" />
          <span className="text-2xl font-semibold text-[#212529]">
            {Array.isArray(filteredPayrolls) ? filteredPayrolls.length : 0}
          </span>
          <span className="text-sm text-[#868E96]">
            {Array.isArray(filteredPayrolls) && filteredPayrolls.length === 1 
              ? 'Folha' 
              : 'Folhas'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Search Input */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Buscar folhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-[#DEE2E6] rounded-lg text-sm placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Buscar folhas de pagamento"
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

          <div className="flex items-center gap-3">
            {/* Filters */}
            <PayrollFiltersComponent
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              companies={companies}
            />

            {/* Create Button */}
            <Button
              className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-4"
              onClick={handleCreatePayroll}
              aria-label="Gerar nova folha de pagamento"
            >
              <Plus className="w-4 h-4" />
              Gerar Folhas
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#868E96]">Filtros ativos:</span>
            {filters.companyId && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Empresa: {companies.find((c) => c.id === filters.companyId)?.razaoSocial}
              </span>
            )}
            {filters.competencia && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Competência: {new Date(filters.competencia + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-2">Erro ao carregar folhas de pagamento</p>
              <p className="text-sm text-[#868E96]">
                {formatError(error as any, 'Tente novamente mais tarde')}
              </p>
            </div>
          </div>
        ) : (
          <PayrollTable
            payrolls={filteredPayrolls as FolhaPagamentoModel[]}
            isLoading={isLoading}
            onView={handleViewHolerites}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={handleClose}
            onReopen={handleReopen}
          />
        )}
      </div>
    </div>
  );
}
