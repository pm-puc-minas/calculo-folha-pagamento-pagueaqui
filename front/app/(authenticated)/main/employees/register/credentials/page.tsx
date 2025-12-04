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
import { useCreateUser } from "@/app/lib/api/generated";
import { toIsoNoonUTC } from "@/app/lib/formatters";
import api from "@/app/lib/axios";

const credentialsTexts = {
  invalidEmail: "E-mail inválido",
  minPassword: "A senha deve ter no mínimo 8 caracteres",
};

const credentialsSchema = z
  .object({
    password: z.string().min(8, credentialsTexts.minPassword),
    password2: z.string().min(8, credentialsTexts.minPassword),
  })
  .refine((data) => data.password === data.password2, {
    message: "As senhas não coincidem",
    path: ["password2"], // o erro aparece no campo password2
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
  const createUserMutation = useCreateUser();
  
const methods = useForm<CredentialsForm>({
  resolver: zodResolver(credentialsSchema),
  mode: "onChange",
  defaultValues: {
    password: credentialsData.password || "",
    password2: "",
  },
});

  const onSubmit = async (data: CredentialsForm) => {
    try {
      setIsSubmitting(true);
      updateCredentialsData(data);

      const enderecoParts = [
        personalData.rua,
        personalData.numero,
        personalData.bairro,
        personalData.cidade,
        personalData.estado,
        personalData.cep,
      ].filter(Boolean);

      const funcionario = {
        nome: personalData.nome || undefined,
        sobrenome: personalData.sobrenome || undefined,
        cpf: personalData.cpf ? personalData.cpf.replace(/\D/g, "") : undefined,
        rg: personalData.rg ? personalData.rg.replace(/\D/g, "") : undefined,
        email: personalData.email || undefined,
        emailProfissional: professionalData.emailProfissional || undefined,
        endereco: enderecoParts.join(", ") || undefined,
        dataDeNascimento: personalData.dataDeNascimento ? toIsoNoonUTC(personalData.dataDeNascimento) : undefined,
        dataDeAdmissao: professionalData.dataDeAdmissao ? toIsoNoonUTC(professionalData.dataDeAdmissao) : undefined, 
        pis: professionalData.pis
          ? Number((professionalData.pis as string).replace(/\D/g, ""))
          : undefined,
        cargoId: professionalData.cargoId ? parseInt(professionalData.cargoId) : undefined,
        senha: data.password,
        bairro: personalData.bairro,
        cep: personalData.cep,
        rua: personalData.rua,
        numero: personalData.numero,
        estado: personalData.estado,
        cidade: personalData.cidade,
        estadoCivil: personalData.estadoCivil,
        genero: personalData.genero,
        banco: {
          id: null,
          conta: bankData.conta,
          agencia: bankData.agencia,
          codigoBanco: bankData.codigoBanco,
          digitoVerificador: bankData.digitoVerificador,
          banco: bankData.banco
        }
      };

      await createUserMutation.mutateAsync({ data: funcionario });

      try {
        const nomeCompleto = [personalData.nome, personalData.sobrenome]
          .filter(Boolean)
          .join(" ");
        await api.post("/funcionario/invite", {
          email: professionalData.emailProfissional,
          nome: nomeCompleto || undefined,
          empresa: undefined,
          senha: data.password,
        });
      } catch (e) {
        console.warn("Falha ao enviar convite por email:", e);
      }

      clearAll();
      router.push("/main/employees?success=true");
    } catch (error) {
      console.error("Erro ao criar colaborador:", error);
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
              name="password" 
              label="Senha" 
              placeholder="Senha"
              type="password"
            />
            <Input 
              methods={methods} 
              name="password2" 
              label="Senha novamente" 
              placeholder="Senha novamente"
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
              <Button type="submit" disabled={isSubmitting || !methods.formState.isValid}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
