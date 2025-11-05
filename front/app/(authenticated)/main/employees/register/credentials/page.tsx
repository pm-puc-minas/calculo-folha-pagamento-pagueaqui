"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Calendar, IdCard, Lock, User2, Wallet } from "lucide-react";
import { useState } from "react";
import { useEmployeeRegistration } from "@/app/context/employeeRegistrationContext";

const credentialsSchema = z.object({
  professionalEmail: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type CredentialsForm = z.infer<typeof credentialsSchema>;

export default function EmployeeRegisterStep5() {
  const router = useRouter();
  const { 
    credentialsData, 
    updateCredentialsData,
    personalData,
    professionalData,
    documentsData,
    bankData,
    clearAll 
  } = useEmployeeRegistration();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const methods = useForm<CredentialsForm>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      professionalEmail: credentialsData.professionalEmail || professionalData.professionalEmail || "",
      password: credentialsData.password || "",
    },
  });

  const onSubmit = async (data: CredentialsForm) => {
    try {
      setIsSubmitting(true);
      updateCredentialsData(data);

      const employeePayload = {
        // Dados pessoais
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        phone: personalData.phone,
        email: personalData.email,
        birthDate: personalData.birthDate,
        maritalStatus: personalData.maritalStatus,
        gender: personalData.gender,
        nationality: personalData.nationality,
        address: {
          street: personalData.street,
          district: personalData.district,
          number: personalData.number,
          city: personalData.city,
          state: personalData.state,
          zip: personalData.zip,
        },
        // Dados profissionais
        employeeId: professionalData.employeeId,
        position: professionalData.position,
        professionalEmail: data.professionalEmail,
        department: professionalData.department,
        admissionDate: professionalData.admissionDate,
        pisPasep: professionalData.pisPasep,
        dependents: professionalData.dependents,
        // Dados bancários
        bankAccount: {
          account: bankData.account,
          agency: bankData.agency,
          verificationDigit: bankData.verificationDigit,
          bank: bankData.bank,
        },
        // Credenciais
        credentials: {
          professionalEmail: data.professionalEmail,
          password: data.password,
        },
      };

      console.log("Payload completo:", employeePayload);
      console.log("Documentos:", documentsData);

      // aqui tem que esperar o back para implementar a chamada da api
    
      await new Promise(resolve => setTimeout(resolve, 1500));

       // aqui tem que esperar o back para implementar o envio do email

      clearAll();
      router.push("/main/employees?success=true");
    } catch (error) {
      console.error("Erro ao criar colaborador:", error);
      alert("Erro ao criar colaborador. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const formData = methods.getValues();
    updateCredentialsData(formData);
    router.push("/main/employees/register/bank");
  };

  const handleCancel = () => {
    if (confirm("Tem certeza que deseja cancelar? Todos os dados serão perdidos.")) {
      clearAll();
      router.push("/main/employees");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl">
        <div className="px-6 md:px-8 pt-4">
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList>
              <TabsTrigger 
                value="personal" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register")}
              >
                <User2 className="w-4 h-4" /> Informações Pessoais
              </TabsTrigger>
              <TabsTrigger 
                value="professional" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/professional")}
              >
                <IdCard className="w-4 h-4" /> Informações Profissionais
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/documents")}
              >
                <Calendar className="w-4 h-4" /> Documentos
              </TabsTrigger>
              <TabsTrigger 
                value="bank" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/bank")}
              >
                <Wallet className="w-4 h-4" /> Dados Bancários
              </TabsTrigger>
              <TabsTrigger value="credentials" className="gap-2">
                <Lock className="w-4 h-4" /> Credenciais
              </TabsTrigger>
            </TabsList>
            <TabsContent value="credentials" className="mt-6" />
          </Tabs>
        </div>

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="px-6 md:px-8 pb-6 md:pb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              methods={methods} 
              name="professionalEmail" 
              label="E-mail Profissional" 
              placeholder="E-mail Profissional"
              type="email"
            />
            <Input 
              methods={methods} 
              name="password" 
              label="Senha" 
              placeholder="Senha"
              type="password"
            />
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
