/**
 * API service for Position (Cargo) management
 * Consumes backend endpoints without modification
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Position, PositionFormInput } from "./types";
import type { Department } from "../departments/types";
import api, { formatError } from "@/app/lib/axios";
import { AxiosError } from "axios";

/**
 * Query keys for React Query cache management
 */
const QUERY_KEYS = {
  positions: ["positions"] as const,
  position: (id: number) => ["positions", id] as const,
  departments: ["departments"] as const,
};

/**
 * Hook to fetch all positions
 * Endpoint: GET /cargo/list
 */
export function usePositions() {
  return useQuery<Position[]>({
    queryKey: QUERY_KEYS.positions,
    queryFn: async () => {
      const { data } = await api.get<Position[]>("/cargo/list");
      return Array.isArray(data) ? data : [];
    },
  });
}

/**
 * Hook to fetch single position by ID
 * Endpoint: GET /cargo/findById/{id}
 */
export function usePosition(id: number, enabled = true) {
  return useQuery<Position>({
    queryKey: QUERY_KEYS.position(id),
    queryFn: async () => {
      const { data } = await api.get<Position>(`/cargo/findById/${id}`);
      return data;
    },
    enabled: enabled && !!id,
  });
}

/**
 * Hook to fetch all departments (for form dropdown)
 * Endpoint: GET /departamento/list
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
 * Hook to create position
 * Endpoint: POST /cargo/create
 * Body: { name: string, departamento: { id: number }, salarioBase: number }
 * Field 'departamento' has @NotNull validation
 * Note: Backend returns cargo with departamento:null due to @JsonBackReference
 * So we fetch the created cargo again to get complete data
 */
export function useCreatePosition() {
  const queryClient = useQueryClient();

  return useMutation<Position, AxiosError, PositionFormInput>({
    mutationFn: async (data: PositionFormInput) => {
      // Create the position
      const createResponse = await api.post<Position>("/cargo/create", data);
      const createdId = createResponse.data.id;
      
      // Fetch the complete position data (workaround for @JsonBackReference)
      const { data: completePosition } = await api.get<Position>(`/cargo/findById/${createdId}`);
      return completePosition;
    },
    onSuccess: () => {
      // Invalidate positions list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.positions });
    },
  });
}

/**
 * Hook to delete position (hard delete)
 * Endpoint: DELETE /cargo/deleteById/{id}
 * Note: This is a permanent deletion
 */
export function useDeletePosition() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/cargo/deleteById/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.positions });
    },
  });
}

/**
 * NOTE: Update functionality not available
 * Backend does not have a PUT/PATCH endpoint for positions
 * TODO: Implement when backend adds update endpoint
 */

export { formatError };
