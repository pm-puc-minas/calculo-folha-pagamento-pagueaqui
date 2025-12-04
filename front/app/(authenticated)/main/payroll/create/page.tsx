/**
 * CREATE PAYROLL PAGE
 * Wizard for creating new payroll
 */

'use client';

import { PayrollWizard } from '../components/PayrollWizard';
import { useListCompanies } from '@/app/lib/api/generated/company-controller/company-controller';
import { useListUsers } from '@/app/lib/api/generated/funcionario-controller/funcionario-controller';
import type { CompanyModel, FuncionarioModel } from '@/app/lib/api/generated/hRPayrollAPI.schemas';

export default function CreatePayrollPage() {
  // Fetch companies from API
  const { data: companiesData, isLoading: isLoadingCompanies, error: companiesError } = useListCompanies();
  
  // FuncionarioModel doesn't have company_id relationship
  // So we fetch ALL employees and let the user manually search/select
  const { data: employeesData, isLoading: isLoadingEmployees, error: employeesError } = useListUsers();

  // Normalize API responses into arrays regardless of backend shape
  const safeParse = (input: unknown): unknown => {
    if (typeof input === 'string') {
      try {
        return JSON.parse(input);
      } catch {
        return input;
      }
    }
    return input;
  };

  const normalizeToArray = <T,>(raw: unknown): T[] => {
    const data = safeParse(raw);
    // Already an array
    if (Array.isArray(data)) return data as T[];
    // Common wrappers: { data: [...] }, { content: [...] }, { items: [...] }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      for (const key of ['data', 'content', 'items', 'list', 'result']) {
        const v = obj[key];
        if (Array.isArray(v)) return v as T[];
      }
    }
    // Single item → wrap
    if (data && typeof data === 'object') return [data as T];
    // Fallback empty
    return [];
  };

  const companies: CompanyModel[] = normalizeToArray<CompanyModel>(companiesData);
  const employees: FuncionarioModel[] = normalizeToArray<FuncionarioModel>(employeesData);


  // Transform to expected format
  const formattedCompanies = (companies || [])
    .filter((c): c is CompanyModel & { id: number } => c.id !== undefined)
    .map((c) => ({
      id: c.id,
      razaoSocial: c.razaoSocial || '',
      nomeFantasia: c.nomeFantasia,
    }));

  return (
    <PayrollWizard
      companies={formattedCompanies}
      employees={employees || []}
      isLoadingEmployees={isLoadingEmployees}
      isLoadingCompanies={isLoadingCompanies}
    />
  );
}
