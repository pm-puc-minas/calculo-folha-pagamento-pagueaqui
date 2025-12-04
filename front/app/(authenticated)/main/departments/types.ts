/**
 * Types for Department management
 * Based on DepartamentoModel from backend
 */

/**
 * Cargo (Position) within a department
 * Based on CargoModel
 */
export interface Cargo {
  id: number;
  name: string;
  salarioBase?: number;
  departamento?: {
    id: number;
    nome: string;
  };
}

/**
 * Department entity
 * Based on DepartamentoModel
 */
export interface Department {
  id: number;
  nome: string;
  cargos?: Cargo[];
}

/**
 * Form input for creating department
 * Backend requires only 'nome' field (NotBlank validation)
 */
export interface DepartmentFormInput {
  nome: string;
}

/**
 * Filters for client-side search
 * Note: Backend does not support server-side filtering
 * TODO: Request backend to add query params support
 */
export interface DepartmentFilters {
  searchTerm: string;
}
