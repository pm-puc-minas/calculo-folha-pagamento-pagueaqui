/**
 * TYPES FOR FOLHA DE PAGAMENTO (PAYROLL)
 * Based on generated API contract from backend
 * 
 * ⚠️ CRITICAL CONTRACT GAPS - MISSING FROM BACKEND:
 * 
 */

import type { 
  FolhaPagamentoModel, 
  CompanyModel,
  FuncionarioModel 
} from '@/app/lib/api/generated/hRPayrollAPI.schemas';

// ============================================
// CORE TYPES (from contract)
// ============================================

export type Payroll = FolhaPagamentoModel;
export type Company = CompanyModel;
export type Employee = FuncionarioModel;

// ============================================
// EXTENDED TYPES (for frontend workflow)
// ============================================

/**
 * Payroll status enum - NOT IN BACKEND CONTRACT
 * TODO: Backend must add this enum to FolhaPagamentoModel
 */
export enum PayrollStatus {
  DRAFT = 'DRAFT',           // Em elaboração - can edit
  PROCESSING = 'PROCESSING', // Em processamento - read-only
  CLOSED = 'CLOSED',         // Fechada - cannot edit, can view holerites
  REOPENED = 'REOPENED',     // Reaberta - can edit again
}

/**
 * Extended payroll with status - DESIRED TYPE
 * TODO: Backend should return this structure
 */
export interface PayrollWithStatus extends Payroll {
  status?: PayrollStatus; // Optional until backend implements
  createdAt?: string;
  updatedAt?: string;
  closedAt?: string;
  closedBy?: string; // User who closed the payroll
}

/**
 * Payroll item linking employee to payroll - NOT IN BACKEND
 * TODO: Backend needs FolhaItemModel entity
 */
export interface PayrollItem {
  id?: number;
  folhaPagamentoId: number;
  funcionarioId: number;
  funcionario?: Employee;
  salarioBruto: number;
  horasExtras?: number;
  adicionalPericulosidade?: number;
  adicionalInsalubridade?: number;
  comissao?: number;
  descontoVT?: number;
  descontoVA?: number;
  descontoINSS?: number;
  descontoIRRF?: number;
  totalProventos: number;
  totalDescontos: number;
  salarioLiquido: number;
  observacoes?: string;
}

/**
 * Form data for wizard steps - CLIENT ONLY
 */
export interface PayrollFormData {
  // Step 1: Basic info
  companyId?: number;
  competencia?: string; // YYYY-MM format
  dataFolha?: string;
  observacoes?: string;
  
  // Step 2: Employee selection - NOT IN BACKEND
  selectedEmployeeIds?: number[];
  
  // Steps 3-7: Per-employee values - NOT IN BACKEND
  employeeItems?: Map<number, Partial<PayrollItem>>;
}

/**
 * Filter params for listing - PARTIALLY SUPPORTED
 */
export interface PayrollFilters {
  companyId?: number;
  competencia?: string; // YYYY-MM
  status?: PayrollStatus; // TODO: Backend doesn't support this
  searchTerm?: string;    // TODO: Backend doesn't support full-text search
  dataInicio?: string;    // Supported via findByCompanyIdAndData
  dataFim?: string;       // Supported via findByCompanyIdAndData
  page?: number;          // TODO: Backend doesn't support pagination
  pageSize?: number;      // TODO: Backend doesn't support pagination
}

/**
 * Holerite (payslip) data - NOT IN BACKEND
 * TODO: Backend needs endpoint to generate
 */
export interface Holerite {
  folhaPagamentoId: number;
  funcionarioId: number;
  formato: 'PDF' | 'HTML';
  conteudo: string; // Base64 for PDF, HTML string for HTML
  geradoEm: string;
  geradoPor: string;
}

/**
 * Workflow transition request - NOT IN BACKEND
 * TODO: Backend needs POST /folhas/{id}/close, /folhas/{id}/reopen, etc.
 */
export interface PayrollTransitionRequest {
  folhaPagamentoId: number;
  action: 'close' | 'reopen' | 'submit' | 'cancel';
  observacao?: string;
}

// ============================================
// API ERROR HANDLING (from contract)
// ============================================

export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  );
};

// ============================================
// VALIDATION SCHEMAS
// Should match backend Jakarta validations
// ============================================

export const VALIDATION_RULES = {
  dataFolha: {
    required: 'Data da folha é obrigatória',
    maxDate: new Date(), // Cannot be future
  },
  valorTotal: {
    required: 'Valor total é obrigatório',
    min: 0.01,
    minMessage: 'Valor total deve ser maior que zero',
  },
  company: {
    required: 'Empresa é obrigatória',
  },
  competencia: {
    required: 'Competência (mês/ano) é obrigatória',
    pattern: /^\d{4}-(0[1-9]|1[0-2])$/,
    message: 'Formato inválido. Use YYYY-MM',
  },
} as const;

// ============================================
// CONSTANTS
// ============================================

export const PAYROLL_STATUS_LABELS: Record<PayrollStatus, string> = {
  [PayrollStatus.DRAFT]: 'Rascunho',
  [PayrollStatus.PROCESSING]: 'Em Processamento',
  [PayrollStatus.CLOSED]: 'Fechada',
  [PayrollStatus.REOPENED]: 'Reaberta',
};

export const PAYROLL_STATUS_COLORS: Record<PayrollStatus, string> = {
  [PayrollStatus.DRAFT]: 'bg-gray-100 text-gray-700',
  [PayrollStatus.PROCESSING]: 'bg-blue-100 text-blue-700',
  [PayrollStatus.CLOSED]: 'bg-green-100 text-green-700',
  [PayrollStatus.REOPENED]: 'bg-yellow-100 text-yellow-700',
};

/**
 * Wizard steps matching the image workflow
 */
export const WIZARD_STEPS = [
  { id: 'info', label: 'Informações Básicas', order: 1 },
  { id: 'employees', label: 'Colaboradores', order: 2 },
  { id: 'discounts', label: 'Desconto VT', order: 3 },
  { id: 'extras', label: 'Horas Extras', order: 4 },
  { id: 'periculosidade', label: 'Adicional de Periculosidade', order: 5 },
  { id: 'insalubridade', label: 'Adicional de Insalubridade', order: 6 },
  { id: 'comissao', label: 'Comissão', order: 7 },
  { id: 'review', label: 'Revisão e Confirmação', order: 8 },
] as const;

export type WizardStepId = typeof WIZARD_STEPS[number]['id'];
