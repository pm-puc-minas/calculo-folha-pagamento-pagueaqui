/**
 * PAYROLL WIZARD - CREATE/EDIT PAYROLL
 * Multi-step wizard following the exact flow from the design
 * 
 * WORKFLOW STEPS (from image):
 * 1. Informações Básicas (Company, Competência, Data)
 * 2. Colaboradores (Employee Selection) - ⚠️ Backend NOT implemented
 * 3. Desconto VT - ⚠️ Backend NOT implemented
 * 4. Horas Extras - ⚠️ Backend NOT implemented
 * 5. Adicional de Periculosidade - ⚠️ Backend NOT implemented
 * 6. Adicional de Insalubridade - ⚠️ Backend NOT implemented
 * 7. Comissão - ⚠️ Backend NOT implemented
 * 8. Revisão e Confirmação
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { toast } from 'sonner';
import { PayrollWizardStepper } from './PayrollWizardStepper';
import { Step1BasicInfo } from './wizard-steps/Step1BasicInfo';
import { Step2EmployeeSelection } from './wizard-steps/Step2EmployeeSelection';
import { useCreatePayroll, formatError } from '../api';
import type { PayrollFormData, WizardStepId } from '../types';
import { WIZARD_STEPS, VALIDATION_RULES } from '../types';
import type { FolhaPagamentoModel } from '@/app/lib/api/generated/hRPayrollAPI.schemas';

interface PayrollWizardProps {
  companies?: Array<{ id: number; razaoSocial: string; nomeFantasia?: string }>;
  employees?: Array<any>;
  isLoadingEmployees?: boolean;
  isLoadingCompanies?: boolean;
}

export function PayrollWizard({
  companies = [],
  employees = [],
  isLoadingEmployees,
  isLoadingCompanies,
}: PayrollWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStepId>('info');
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStepId>>(new Set());
  const [formData, setFormData] = useState<PayrollFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreatePayroll();

  const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;

  // Update form data
  const handleDataChange = (data: Partial<PayrollFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear errors for changed fields
    const changedKeys = Object.keys(data);
    setErrors((prev) => {
      const newErrors = { ...prev };
      changedKeys.forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  };

  // Validate current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'info') {
      if (!formData.dataFolha) {
        newErrors.dataFolha = VALIDATION_RULES.dataFolha.required;
      } else {
        const folhaDate = new Date(formData.dataFolha);
        if (folhaDate > VALIDATION_RULES.dataFolha.maxDate) {
          newErrors.dataFolha = 'Data da folha não pode ser futura';
        }
      }
      if (!formData.competencia) {
        newErrors.competencia = VALIDATION_RULES.competencia.required;
      } else if (!VALIDATION_RULES.competencia.pattern.test(formData.competencia)) {
        newErrors.competencia = VALIDATION_RULES.competencia.message;
      }
    }

    if (currentStep === 'employees') {
      if (!formData.selectedEmployeeIds || formData.selectedEmployeeIds.length === 0) {
        newErrors.employees = 'Selecione pelo menos um colaborador';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to step
  const goToStep = (stepId: WizardStepId) => {
    const targetIndex = WIZARD_STEPS.findIndex((s) => s.id === stepId);
    if (targetIndex <= currentStepIndex || completedSteps.has(stepId)) {
      setCurrentStep(stepId);
    }
  };

  // Next step
  const handleNext = () => {
    if (!validateStep()) {
      toast.error('Por favor, corrija os erros antes de continuar');
      return;
    }

    // Mark current step as completed
    setCompletedSteps((prev) => new Set(prev).add(currentStep));

    // Move to next step
    if (!isLastStep) {
      const nextStep = WIZARD_STEPS[currentStepIndex + 1];
      setCurrentStep(nextStep.id);
    }
  };

  // Previous step
  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = WIZARD_STEPS[currentStepIndex - 1];
      setCurrentStep(prevStep.id);
    }
  };

  // Submit payroll
  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error('Por favor, corrija os erros antes de salvar');
      return;
    }

    //  Backend only supports basic FolhaPagamentoModel
    // It doesn't have:
    // - Status field
    // - Employee items
    // - Individual adicionals/descontos per payroll
    
    try {
      // Build minimal payload that backend accepts
      const payload: FolhaPagamentoModel = {
        company: companies[0] ? {
          id: companies[0].id,
          cnpj: '', // TODO: Need to fetch full company data
          razaoSocial: companies[0].razaoSocial,
          nomeFantasia: companies[0].nomeFantasia,
        } : undefined as any,
        dataFolha: formData.dataFolha!,
        valorTotal: 0, // TODO: Calculate from items
        numeroHorasTrabalhadas: 0, // TODO: Sum from employee data
        salarioBase: 0, // TODO: Calculate
        observacoes: formData.observacoes,
      };

      toast.warning('Salvando apenas dados básicos. Backend não suporta itens detalhados.');

      await createMutation.mutateAsync({ data: payload });

      toast.success('Folha de pagamento criada com sucesso!', {
        description: 'Atenção: Itens de colaboradores não foram salvos (backend não implementado)',
      });

      // Navigate back to list
      router.push('/main/payroll');
    } catch (error: any) {
      const errorMessage = formatError(error, 'Erro ao criar folha de pagamento');
      toast.error(errorMessage);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    if (window.confirm('Deseja realmente cancelar? Os dados não salvos serão perdidos.')) {
      router.push('/main/payroll');
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'info':
        return (
          <Step1BasicInfo
            data={formData}
            onChange={handleDataChange}
            errors={errors}
            companies={companies}
            isLoadingCompanies={isLoadingCompanies}
          />
        );

      case 'employees':
        return (
          <Step2EmployeeSelection
            data={formData}
            onChange={handleDataChange}
            employees={employees}
            isLoadingEmployees={isLoadingEmployees}
          />
        );

      case 'discounts':
      case 'extras':
      case 'periculosidade':
      case 'insalubridade':
      case 'comissao':
        return (
          <div className="space-y-6">
            <div className="p-8 bg-red-50 border-2 border-red-200 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ⚠️ Funcionalidade Não Implementada
              </h3>
              <p className="text-sm text-red-700 mb-4">
                O backend não possui endpoints para gerenciar:
              </p>
              <ul className="text-xs text-red-600 text-left max-w-md mx-auto space-y-1 list-disc list-inside">
                <li>Itens individuais de folha por colaborador</li>
                <li>Adicional de periculosidade/insalubridade</li>
                <li>Horas extras por período</li>
                <li>Descontos específicos (VT, VA/VR)</li>
                <li>Comissões por folha</li>
              </ul>
              <p className="text-xs text-red-700 mt-4">
                <strong>Necessário:</strong> Implementar entidade FolhaItem no backend com campos para
                todos os proventos e descontos, além de endpoints CRUD para gerenciá-los.
              </p>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[#212529] mb-2">
                Revisão e Confirmação
              </h2>
              <p className="text-sm text-[#868E96]">
                Revise os dados antes de salvar a folha de pagamento.
              </p>
            </div>

            <div className="border border-[#DEE2E6] rounded-lg divide-y divide-[#DEE2E6]">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[#495057] mb-2">Informações Básicas</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#868E96]">Competência:</dt>
                    <dd className="text-[#212529] font-medium">
                      {formData.competencia
                        ? new Date(formData.competencia + '-01').toLocaleDateString('pt-BR', {
                            month: 'long',
                            year: 'numeric',
                          })
                        : '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#868E96]">Data da Folha:</dt>
                    <dd className="text-[#212529] font-medium">
                      {formData.dataFolha
                        ? new Date(formData.dataFolha).toLocaleDateString('pt-BR')
                        : '-'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-[#495057] mb-2">Colaboradores</h3>
                <p className="text-sm text-[#212529]">
                  {formData.selectedEmployeeIds?.length || 0} colaborador(es) selecionado(s)
                </p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-semibold">
                ⚠️ Limitações do Backend
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Apenas informações básicas serão salvas. Itens detalhados de colaboradores,
                adicionals e descontos não serão persistidos pois o backend não possui
                suporte para estas funcionalidades.
              </p>
            </div>
          </div>
        );

      default:
        return <div>Step not implemented</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      {/* Stepper */}
      <PayrollWizardStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-[#DEE2E6] bg-white px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            aria-label="Cancelar"
          >
            Cancelar
          </Button>

          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="gap-2"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>
            )}

            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                isLoading={createMutation.isPending}
                className="gap-2"
                aria-label="Salvar folha"
              >
                <Save className="w-4 h-4" />
                Salvar Folha
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2"
                aria-label="Próximo passo"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
