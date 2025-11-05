"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectItem } from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Calendar, IdCard, Lock, User2, Wallet } from "lucide-react";
import { useEmployeeRegistration } from "@/app/context/employeeRegistrationContext";

const professionalSchema = z.object({
  employeeId: z.string().optional(),
  username: z.string().optional(),
  position: z.string().optional(),
  professionalEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  department: z.string().optional(),
  weeklyHours: z.number().optional(),
  workDays: z.string().optional(),
  admissionDate: z.string().optional(),
  pisPasep: z.string().optional(),
  dependents: z.number().optional(),
});

type ProfessionalForm = z.infer<typeof professionalSchema>;

const workDaysOptions = [
  { value: "segunda-sexta", label: "Segunda a Sexta" },
  { value: "segunda-sabado", label: "Segunda a Sábado" },
  { value: "escala", label: "Escala" },
];

export default function EmployeeRegisterStep2() {
  const router = useRouter();
  const { professionalData, updateProfessionalData } = useEmployeeRegistration();
  const methods = useForm<ProfessionalForm>({ 
    resolver: zodResolver(professionalSchema),
    defaultValues: professionalData,
  });

  const onSubmit = (data: ProfessionalForm) => {
    updateProfessionalData(data);
    router.push("/main/employees/register/documents");
  };

  const handleBack = () => {
    const formData = methods.getValues();
    updateProfessionalData(formData);
    router.push("/main/employees/register");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl">
        <div className="px-6 md:px-8 pt-4">
          <Tabs defaultValue="professional" className="w-full">
            <TabsList>
              <TabsTrigger 
                value="personal" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register")}
              >
                <User2 className="w-4 h-4" /> Informações Pessoais
              </TabsTrigger>
              <TabsTrigger value="professional" className="gap-2">
                <IdCard className="w-4 h-4" /> Informações Profissionais
              </TabsTrigger>
              <TabsTrigger value="documents" disabled className="gap-2">
                <Calendar className="w-4 h-4" /> Documentos
              </TabsTrigger>
              <TabsTrigger value="bank" disabled className="gap-2">
                <Wallet className="w-4 h-4" /> Dados Bancários
              </TabsTrigger>
              <TabsTrigger value="credentials" disabled className="gap-2">
                <Lock className="w-4 h-4" /> Credenciais
              </TabsTrigger>
            </TabsList>
            <TabsContent value="professional" className="mt-6" />
          </Tabs>
        </div>

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="px-6 md:px-8 pb-6 md:pb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID do Colaborador */}
            <Input 
              methods={methods} 
              name="employeeId" 
              label="ID do Colaborador" 
              placeholder="ID do Colaborador" 
            />

            {/* Cargo */}
            <Select
              methods={methods}
              name="position"
              placeholder="Cargo"
              label="Cargo"
            >
              <SelectItem value="desenvolvedor">Desenvolvedor</SelectItem>
              <SelectItem value="gerente">Gerente</SelectItem>
              <SelectItem value="analista">Analista</SelectItem>
              <SelectItem value="coordenador">Coordenador</SelectItem>
            </Select>

            {/* E-mail profissional */}
            <Input 
              methods={methods} 
              name="professionalEmail" 
              label="E-mail profissional" 
              placeholder="E-mail profissional" 
              type="email"
            />

            {/* Departamento */}
            <Select
              methods={methods}
              name="department"
              placeholder="Departamento"
              label="Departamento"
            >
              <SelectItem value="ti">Tecnologia da Informação</SelectItem>
              <SelectItem value="rh">Recursos Humanos</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="operacoes">Operações</SelectItem>
            </Select>

            {/* Data de admissão */}
            <Input
              methods={methods}
              name="admissionDate"
              label="Data de admissão"
              type="date"
            />

            {/* PIS/PASEP */}
            <Input 
              methods={methods} 
              name="pisPasep" 
              label="PIS/PASEP" 
              placeholder="PIS/PASEP"
              mask="999.99999.99-9"
            />

            {/* Dependentes */}
            <Input 
              methods={methods} 
              name="dependents" 
              label="Dependentes" 
              placeholder="Dependentes"
              isNumeric
              allowNegative={false}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button type="submit" className="bg-primary text-white">
              Próximo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
