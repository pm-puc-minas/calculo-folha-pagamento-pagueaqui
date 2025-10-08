// interfaces para respostas de erro da API

export interface BadRequestGenericResponseDto {
  message: string;
  error?: string;
  statusCode: 400;
}

export interface UnauthorizedGenericResponseDto {
  message: string;
  error?: string;
  statusCode: 401;
}

export interface ForbiddenGenericResponseDto {
  message: string;
  error?: string;
  statusCode: 403;
}

export interface NotFoundGenericResponseDto {
  message: string;
  error?: string;
  statusCode: 404;
}

export interface GenericResponseDto<T = any> {
  data: T;
  message: string;
  status: number;
  error?: string;
}

export interface UserDto {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  salario: number;
  dataAdmissao: string;
  ativo: boolean;
}

export interface CompanyDto {
  id: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
}

export interface FolhaPagamentoDto {
  id: number;
  companyId: number;
  dataFolha: string;
  valorTotal: number;
  numeroHorasTrabalhadas?: number;
  salarioBase?: number;
  observacoes?: string;
}