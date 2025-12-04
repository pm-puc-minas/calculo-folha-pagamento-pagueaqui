/**
 * Types for Employee management
 * Based on FuncionarioModel from backend
 */

export interface Cargo {
  id: number;
  name: string;
  departamento?: {
    id: number;
    nome: string;
  };
  salarioBase?: number;
}

export interface Employee {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  rg?: string;
  email: string;
  endereco?: string;
  dataNascimento?: string;
  pis?: number;
  dataDeAdmissao?: string;
  cargo?: Cargo;
  senha?: string;
  proventos?: {
    id?: number;
    salarioBruto?: number;
    horasExtras?: number;
    adicionalNoturno?: boolean;
    adicionalInsalubridade?: boolean;
    adicionalPericulosidade?: boolean;
    valeTransporte?: boolean;
    valeAlimentacaoRefeicao?: boolean;
    planoDeSaude?: boolean;
  };
}

export interface EmployeeFormInput {
  nome: string;
  sobrenome: string;
  cpf: string;
  rg?: string;
  email: string;
  endereco?: string;
  dataNascimento?: string;
  pis?: number;
  dataDeAdmissao?: string;
  cargo?: string;
  senha: string;
  salarioBruto?: number;
}

export interface EmployeeFilters {
  searchTerm: string;
}
