/**
 * PAYROLL TABLE COMPONENT
 * Displays list of payrolls with actions
 */

'use client';

import { formatDateBR } from '@/app/lib/formatters';
import type { FolhaPagamentoModel } from '@/app/lib/api/generated/hRPayrollAPI.schemas';
import { Eye, Pencil, Trash2, Lock, LockOpen } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';

interface PayrollTableProps {
  payrolls: FolhaPagamentoModel[];
  isLoading?: boolean;
  onView?: (payroll: FolhaPagamentoModel) => void;
  onEdit?: (payroll: FolhaPagamentoModel) => void;
  onDelete?: (payroll: FolhaPagamentoModel) => void;
  onClose?: (payroll: FolhaPagamentoModel) => void;
  onReopen?: (payroll: FolhaPagamentoModel) => void;
}

export function PayrollTable({
  payrolls,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onClose,
  onReopen,
}: PayrollTableProps) {
  if (isLoading) {
    return <PayrollTableSkeleton />;
  }

  if (payrolls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-32 h-32 mb-4 opacity-20">
          <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
            <rect x="20" y="32" width="88" height="72" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M20 48h88M20 64h88M20 80h88" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-[#495057] mb-2">
          Não há registros...
        </h3>
        <p className="text-sm text-[#868E96] text-center max-w-md">
          Aqui serão listadas as folhas de pagamento. Clique em &quot;Gerar Folhas&quot; para criar uma nova.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#DEE2E6]">
            <th className="px-4 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
              Empresa
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
              Competência
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#868E96] uppercase tracking-wider">
              Data da Folha
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#868E96] uppercase tracking-wider">
              Valor Total
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#868E96] uppercase tracking-wider">
              Horas Trabalhadas
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#868E96] uppercase tracking-wider w-32">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#DEE2E6]">
          {payrolls.map((payroll) => (
            <PayrollTableRow
              key={payroll.id}
              payroll={payroll}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onClose={onClose}
              onReopen={onReopen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PayrollTableRowProps {
  payroll: FolhaPagamentoModel;
  onView?: (payroll: FolhaPagamentoModel) => void;
  onEdit?: (payroll: FolhaPagamentoModel) => void;
  onDelete?: (payroll: FolhaPagamentoModel) => void;
  onClose?: (payroll: FolhaPagamentoModel) => void;
  onReopen?: (payroll: FolhaPagamentoModel) => void;
}

function PayrollTableRow({
  payroll,
  onView,
  onEdit,
  onDelete,
  onClose,
  onReopen,
}: PayrollTableRowProps) {
  // Extract competencia (YYYY-MM) from dataFolha
  const competencia = payroll.dataFolha 
    ? new Date(payroll.dataFolha).toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      }).replace(/^\w/, (c) => c.toUpperCase())
    : '-';

  // Format currency
  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // ⚠️ TODO: Backend doesn't have status field
  // This should be determined by payroll.status when backend implements it
  const isDraft = true; // payroll.status === 'DRAFT'
  const isClosed = false; // payroll.status === 'CLOSED'

  return (
    <tr 
      className="hover:bg-[#F8F9FA] transition-colors"
      role="row"
    >
      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#212529]">
        <div>
          <div className="font-medium">{payroll.company.razaoSocial}</div>
          {payroll.company.nomeFantasia && (
            <div className="text-xs text-[#868E96]">{payroll.company.nomeFantasia}</div>
          )}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#495057]">
        {competencia}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#495057]">
        {formatDateBR(payroll.dataFolha)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#212529] text-right font-medium">
        {formatCurrency(payroll.valorTotal)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#495057] text-right">
        {payroll.numeroHorasTrabalhadas || '-'}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
        <div className="flex items-center justify-end gap-1">
          {/* View Holerites - TODO: Backend needs holerite endpoint */}
          {isClosed && onView && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(payroll)}
              title="Visualizar Holerites"
              aria-label="Visualizar Holerites"
              className="h-8 w-8 hover:bg-[#E9ECEF]"
            >
              <Eye className="h-4 w-4 text-[#495057]" />
            </Button>
          )}

          {/* Edit - Only for draft */}
          {isDraft && onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(payroll)}
              title="Editar"
              aria-label="Editar folha de pagamento"
              className="h-8 w-8 hover:bg-[#E9ECEF]"
            >
              <Pencil className="h-4 w-4 text-[#495057]" />
            </Button>
          )}

          {/* Close - TODO: Backend needs close endpoint */}
          {isDraft && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onClose(payroll)}
              title="Fechar Folha"
              aria-label="Fechar folha de pagamento"
              className="h-8 w-8 hover:bg-[#E9ECEF]"
            >
              <Lock className="h-4 w-4 text-[#495057]" />
            </Button>
          )}

          {/* Reopen - TODO: Backend needs reopen endpoint */}
          {isClosed && onReopen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onReopen(payroll)}
              title="Reabrir Folha"
              aria-label="Reabrir folha de pagamento"
              className="h-8 w-8 hover:bg-[#E9ECEF]"
            >
              <LockOpen className="h-4 w-4 text-[#495057]" />
            </Button>
          )}

          {/* Delete - Only for draft, TODO: Backend needs delete endpoint */}
          {isDraft && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(payroll)}
              title="Excluir"
              aria-label="Excluir folha de pagamento"
              className="h-8 w-8 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function PayrollTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-[#DEE2E6]">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-32" />
        </div>
      ))}
    </div>
  );
}
