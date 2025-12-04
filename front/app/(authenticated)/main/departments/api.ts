/**
 * API service for Department management
 * Consumes backend endpoints without modification
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Department, DepartmentFormInput } from "./types";
import api, { formatError } from "@/app/lib/axios";
import { AxiosError } from "axios";

/**
 * Query keys for React Query cache management
 */
const QUERY_KEYS = {
  departments: ["departments"] as const,
  department: (id: number) => ["departments", id] as const,
};

/**
 * Hook to fetch all departments
 * Endpoint: GET /departamento/list
 * Note: Backend returns all records, no pagination support
 * TODO: Request backend to add pagination (page/size params)
 */
export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: QUERY_KEYS.departments,
    queryFn: async () => {
      const { data } = await api.get<Department[]>("/departamento/list");
      return Array.isArray(data) ? data : [];
    },
  });
}

/**
 * Hook to fetch single department by ID
 * Endpoint: GET /departamento/findById/{id}
 */
export function useDepartment(id: number, enabled = true) {
  return useQuery<Department>({
    queryKey: QUERY_KEYS.department(id),
    queryFn: async () => {
      const { data } = await api.get<Department>(`/departamento/findById/${id}`);
      return data;
    },
    enabled: enabled && !!id,
  });
}

/**
 * Hook to create department
 * Endpoint: POST /departamento/create
 * Body: { nome: string } - required field with NotBlank validation
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation<Department, AxiosError, DepartmentFormInput>({
    mutationFn: async (data: DepartmentFormInput) => {
      const response = await api.post<Department>("/departamento/create", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate departments list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.departments });
    },
  });
}

/**
 * Hook to delete department (hard delete)
 * Endpoint: DELETE /departamento/deleteById/{id}
 * Note: This is a permanent deletion
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/departamento/deleteById/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.departments });
    },
  });
}

/**
 * NOTE: Update functionality not available
 * Backend does not have a PUT/PATCH endpoint for departments
 * TODO: Implement when backend adds update endpoint
 */

export { formatError };
