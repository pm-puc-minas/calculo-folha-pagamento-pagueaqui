/**
 * API service for Employee management
 * Extends orval-generated hooks with additional functionality
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Employee, EmployeeFormInput } from "./types";
import { 
  useCreateUser, 
  getListUsersQueryKey,
  useGetUser 
} from "@/app/lib/api/generated/funcionario-controller/funcionario-controller";
import api, { formatError } from "@/app/lib/axios";
import { AxiosError } from "axios";

/**
 * Hook to fetch all employees
 * Endpoint: GET /funcionario/list
 * Note: Backend has circular reference issue (funcionario -> proventos -> funcionario)
 */
export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/funcionario/list", {
          transformResponse: [(data) => {
            // Backend retorna string truncada devido a referência circular
            if (typeof data === "string") {
              // Encontrar a última chave completa do array
              const lastValidBracket = data.lastIndexOf('}]');
              if (lastValidBracket !== -1) {
                const validJson = data.substring(0, lastValidBracket + 2);
                return JSON.parse(validJson);
              }
            }
            return data;
          }],
        });
        
        console.log("Employees carregados:", data?.length || 0);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        return [];
      }
    },
  });
}

/**
 * Hook to fetch single employee by ID
 */
export function useEmployee(id: number, enabled = true) {
  return useGetUser(id, {
    query: {
      enabled: enabled && !!id,
      select: (data) => {
        if (typeof data === "string") {
          try {
            return JSON.parse(data);
          } catch {
            return null;
          }
        }
        return data;
      },
    },
  });
}

/**
 * Hook to create employee
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useCreateUser({
    mutation: {
      onSuccess: () => {
        // Invalidate employees list to refetch
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      },
    },
  });
}

/**
 * Hook to update employee
 * Note: Backend endpoint doesn't work properly, but keeping for future implementation
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, { id: number; data: Partial<Employee> }>({
    mutationFn: async ({ id, data }) => {
      // Backend PUT /funcionario/update não funciona corretamente
      // Mantendo para implementação futura quando backend for corrigido
      await api.put(`/funcionario/update/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
    },
  });
}

/**
 * Hook to delete employee (hard delete)
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/funcionario/deleteById/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
    },
  });
}

/**
 * Hook to send employee invite
 */
export function useSendInvite() {
  return useMutation<void, AxiosError, { email: string; nome: string; empresa: string; senha: string }>({
    mutationFn: async (data) => {
      await api.post("/funcionario/invite", data);
    },
  });
}

export { formatError };
