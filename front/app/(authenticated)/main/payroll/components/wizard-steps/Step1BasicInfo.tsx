/**
 * WIZARD STEP 1: BASIC INFORMATION
 * Company, competencia, and basic payroll details
 */

'use client';

import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import type { PayrollFormData } from '../../types';

interface Step1BasicInfoProps {
  data: PayrollFormData;
  onChange: (data: Partial<PayrollFormData>) => void;
  errors?: Record<string, string>;
  companies?: Array<{ id: number; razaoSocial: string; nomeFantasia?: string }>;
  isLoadingCompanies?: boolean;
}

export function Step1BasicInfo({
  data,
  onChange,
  errors = {},
  companies = [],
  isLoadingCompanies,
}: Step1BasicInfoProps) {
  // Get current month as default
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#212529] mb-2">
          Informações Básicas da Folha
        </h2>
        <p className="text-sm text-[#868E96]">
          Defina o período de referência para a folha de pagamento.
        </p>
      </div>

      {/* Competencia (Month/Year) */}
      <div>
        <Label htmlFor="competencia" required>
          Competência (Mês/Ano)
        </Label>
        <input
          type="month"
          id="competencia"
          name="competencia"
          value={data.competencia || currentMonth}
          onChange={(e) => onChange({ competencia: e.target.value })}
          className="w-full h-10 px-3 border border-[#DEE2E6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-invalid={!!errors.competencia}
          aria-describedby={errors.competencia ? 'competencia-error' : undefined}
          required
        />
        {errors.competencia && (
          <p id="competencia-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.competencia}
          </p>
        )}
        <p className="mt-1 text-xs text-[#868E96]">
          Selecione o mês e ano de referência da folha de pagamento
        </p>
      </div>

      {/* Data da Folha */}
      <div>
        <Label htmlFor="dataFolha" required>
          Data da Folha
        </Label>
        <input
          type="date"
          id="dataFolha"
          name="dataFolha"
          value={data.dataFolha || ''}
          onChange={(e) => onChange({ dataFolha: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
          className="w-full h-10 px-3 border border-[#DEE2E6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-invalid={!!errors.dataFolha}
          aria-describedby={errors.dataFolha ? 'dataFolha-error' : undefined}
          required
        />
        {errors.dataFolha && (
          <p id="dataFolha-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.dataFolha}
          </p>
        )}
        <p className="mt-1 text-xs text-[#868E96]">
          A data não pode ser futura
        </p>
      </div>

      {/* Observações */}
      <div>
        <Label htmlFor="observacoes">
          Observações (Opcional)
        </Label>
        <textarea
          id="observacoes"
          value={data.observacoes || ''}
          onChange={(e) => onChange({ observacoes: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-[#DEE2E6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Adicione observações sobre esta folha de pagamento..."
          maxLength={500}
          aria-describedby="observacoes-help"
        />
        <p id="observacoes-help" className="mt-1 text-xs text-[#868E96]">
          {data.observacoes?.length || 0}/500 caracteres
        </p>
      </div>

    </div>
  );
}
