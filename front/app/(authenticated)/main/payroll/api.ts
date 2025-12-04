/**
 * API HOOKS FOR PAYROLL (FOLHA DE PAGAMENTO)
 * 
 * Uses generated hooks from orval + React Query
 * All operations follow the backend contract strictly
 */

import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { 
  useListarTodas,
  useBuscarPorId,
  useBuscarPorEmpresa,
  useCriar,
  useGerarNovaFolha,
  getListarTodasQueryKey,
  getBuscarPorIdQueryKey,
  getBuscarPorEmpresaQueryKey,
} from '@/app/lib/api/generated/folha-pagamento-controller/folha-pagamento-controller';
import type { 
  FolhaPagamentoModel,
  GerarNovaFolhaParams,
} from '@/app/lib/api/generated/hRPayrollAPI.schemas';
import type { ApiError, PayrollFilters } from './types';

// ============================================
// QUERY HOOKS (Read Operations)
// ============================================

/**
 * List all payrolls
 */
export const usePayrolls = () => {
  return useListarTodas({
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError<ApiError>;
        // Don't retry on 4xx errors
        if (axiosError.response?.status && axiosError.response.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  });
};

/**
 * Get payroll by ID
 * Backend returns string instead of FolhaPagamentoModel (contract issue)
 * TODO: Backend should return proper typed response
 */
export const usePayrollById = (id?: number) => {
  return useBuscarPorId(id!, {
    query: {
      enabled: !!id && id > 0,
      staleTime: 5 * 60 * 1000,
      retry: false, // Don't retry 404s
    },
  });
};

/**
 * List payrolls by company
 * Backend returns string instead of FolhaPagamentoModel[] (contract issue)
 * TODO: Backend should return proper typed array
 */
export const usePayrollsByCompany = (companyId?: number) => {
  return useBuscarPorEmpresa(companyId!, {
    query: {
      enabled: !!companyId && companyId > 0,
      staleTime: 5 * 60 * 1000,
    },
  });
};

/**
 * Client-side filtering for payrolls
 * This is necessary because backend doesn't support filtering
 * TODO: Backend should implement query parameters for filtering
 */
export const useFilteredPayrolls = (filters?: PayrollFilters) => {
  const { data: allPayrolls = [], ...queryState } = usePayrolls();

  const filteredData = (allPayrolls as FolhaPagamentoModel[]).filter((payroll) => {
    // Filter by company
    if (filters?.companyId && payroll.company?.id !== filters.companyId) {
      return false;
    }

    // Filter by competencia (YYYY-MM)
    if (filters?.competencia && payroll.dataFolha) {
      const payrollMonth = payroll.dataFolha.substring(0, 7); // Extract YYYY-MM
      if (payrollMonth !== filters.competencia) {
        return false;
      }
    }

    // Filter by date range
    if (filters?.dataInicio && payroll.dataFolha < filters.dataInicio) {
      return false;
    }
    if (filters?.dataFim && payroll.dataFolha > filters.dataFim) {
      return false;
    }

    // TODO: Status filter - backend doesn't have status field
    // TODO: Search term - backend doesn't support full-text search

    return true;
  });

  return {
    ...queryState,
    data: filteredData,
  };
};

// ============================================
// MUTATION HOOKS (Write Operations)
// ============================================

/**
 * Create a new payroll
 * POST /folhas/create
 */
export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useCriar({
    mutation: {
      onSuccess: () => {
        // Invalidate all payroll lists
        queryClient.invalidateQueries({ queryKey: getListarTodasQueryKey() });
      },
      retry: false, // Don't retry mutations
    },
  });
};

/**
 * Generate a new payroll (alternative creation method)
 * POST /folhas/gerar/{companyId}
 * 
 * This endpoint calculates initial values based on salarioBase
 */
export const useGeneratePayroll = () => {
  const queryClient = useQueryClient();

  return useGerarNovaFolha({
    mutation: {
      onSuccess: (_, variables) => {
        // Invalidate lists
        queryClient.invalidateQueries({ queryKey: getListarTodasQueryKey() });
        queryClient.invalidateQueries({ 
          queryKey: getBuscarPorEmpresaQueryKey(variables.companyId) 
        });
      },
      retry: false,
    },
  });
};

/**
 * Update payroll - NOT AVAILABLE IN BACKEND
 * TODO: Backend needs PUT /folhas/{id} endpoint
 */
export const useUpdatePayroll = () => {
  // Placeholder - backend doesn't have update endpoint
  throw new Error('UPDATE_NOT_IMPLEMENTED: Backend needs PUT /folhas/{id} endpoint');
};

/**
 * Delete payroll - NOT AVAILABLE IN BACKEND
 * TODO: Backend needs DELETE /folhas/{id} endpoint
 */
export const useDeletePayroll = () => {
  // Placeholder - backend doesn't have delete endpoint exposed via controller
  throw new Error('DELETE_NOT_IMPLEMENTED: Backend needs DELETE /folhas/{id} endpoint in controller');
};

/**
 * Close payroll - NOT AVAILABLE IN BACKEND
 * TODO: Backend needs POST /folhas/{id}/close endpoint with status transition
 */
export const useClosePayroll = () => {
  throw new Error('CLOSE_NOT_IMPLEMENTED: Backend needs workflow state management');
};

/**
 * Reopen payroll - NOT AVAILABLE IN BACKEND
 * TODO: Backend needs POST /folhas/{id}/reopen endpoint with status transition
 */
export const useReopenPayroll = () => {
  throw new Error('REOPEN_NOT_IMPLEMENTED: Backend needs workflow state management');
};

/**
 * Generate holerite (payslip) - NOT AVAILABLE IN BACKEND
 * TODO: Backend needs GET /folhas/{id}/holerite/{funcionarioId} endpoint
 * RelatorioService exists but is not exposed via REST
 */
export const useGenerateHolerite = () => {
  throw new Error('HOLERITE_NOT_IMPLEMENTED: Backend needs to expose RelatorioService via REST API');
};

// ============================================
// ERROR FORMATTING
// ============================================

/**
 * Format API error for user display
 * Handles different error response structures
 */
export const formatError = (error: AxiosError<ApiError>, defaultMessage?: string): string => {
  // Check for response data with message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for error property
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Network or timeout errors
  if (error.code === 'ECONNABORTED') {
    return 'Tempo de requisição excedido. Tente novamente.';
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Erro de conexão. Verifique sua internet.';
  }

  // Validation errors (400)
  if (error.response?.status === 400) {
    return error.response.data?.message || 'Dados inválidos. Verifique o formulário.';
  }

  // Authorization errors (401/403)
  if (error.response?.status === 401) {
    return 'Sessão expirada. Faça login novamente.';
  }

  if (error.response?.status === 403) {
    return 'Você não tem permissão para esta ação.';
  }

  // Not found (404)
  if (error.response?.status === 404) {
    return 'Registro não encontrado.';
  }

  // Server errors (500+)
  if (error.response?.status && error.response.status >= 500) {
    return 'Erro no servidor. Tente novamente mais tarde.';
  }

  // Fallback to provided default or generic message
  return defaultMessage || 'Erro inesperado. Tente novamente.';
};

/**
 * Map backend validation errors to form fields
 * TODO: Backend should return structured validation errors
 */
export const mapValidationErrors = (error: AxiosError<ApiError>): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Current backend doesn't return structured field errors
  // This would need backend to return something like:
  // { field: 'dataFolha', message: 'Data inválida' }
  
  const message = error.response?.data?.message || '';
  
  // Parse common validation messages (hacky, but works for now)
  if (message.includes('Empresa é obrigatória')) {
    errors.companyId = message;
  }
  if (message.includes('Valor total')) {
    errors.valorTotal = message;
  }
  if (message.includes('Data da folha')) {
    errors.dataFolha = message;
  }

  return errors;
};

// ============================================
// CACHE UTILITIES
// ============================================

/**
 * Prefetch payroll by ID
 * Useful for optimistic navigation
 */
export const usePrefetchPayroll = () => {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: getBuscarPorIdQueryKey(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};

/**
 * Manually invalidate all payroll queries
 * Useful after bulk operations
 */
export const useInvalidatePayrolls = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: getListarTodasQueryKey() });
  };
};
