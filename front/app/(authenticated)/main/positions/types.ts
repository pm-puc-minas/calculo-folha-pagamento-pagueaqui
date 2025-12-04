/**
 * Types for Position (Cargo) management
 * Based on CargoModel from backend
 */

/**
 * Department reference in Position
 */
export interface PositionDepartment {
  id: number;
  nome: string;
}

/**
 * Position entity
 * Based on CargoModel
 */
export interface Position {
  id: number;
  name: string;
  departamento: PositionDepartment;
  salarioBase: number;
}

/**
 * Form input for creating position
 * Backend requires: name, departamento (object with id), salarioBase
 * Field 'departamento' has @NotNull validation
 */
export interface PositionFormInput {
  name: string;
  departamento: {
    id: number;
  };
  salarioBase: number;
}

/**
 * Filters for client-side search
 * Note: Backend does not support server-side filtering
 */
export interface PositionFilters {
  searchTerm: string;
}
