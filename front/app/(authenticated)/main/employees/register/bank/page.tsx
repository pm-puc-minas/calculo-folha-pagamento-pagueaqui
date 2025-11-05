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
import { useEffect } from "react";
import { useEmployeeRegistration } from "@/app/context/employeeRegistrationContext";

const bankSchema = z.object({
  account: z.string().min(1, "Conta é obrigatória"),
  agency: z.string().min(1, "Agência é obrigatória"),
  verificationDigit: z.string().min(1, "Dígito verificador é obrigatório"),
  bank: z.string().min(1, "Banco é obrigatório"),
});

type BankForm = z.infer<typeof bankSchema>;

const bankOptions = [
  { value: "001", label: "001 - Banco do Brasil" },
  { value: "033", label: "033 - Santander" },
  { value: "104", label: "104 - Caixa Econômica Federal" },
  { value: "237", label: "237 - Bradesco" },
  { value: "341", label: "341 - Itaú" },
  { value: "356", label: "356 - Banco Real" },
  { value: "389", label: "389 - Banco Mercantil do Brasil" },
  { value: "399", label: "399 - HSBC" },
  { value: "422", label: "422 - Banco Safra" },
  { value: "453", label: "453 - Banco Rural" },
  { value: "633", label: "633 - Banco Rendimento" },
  { value: "652", label: "652 - Itaú Unibanco Holding" },
  { value: "745", label: "745 - Citibank" },
];

export default function EmployeeRegisterStep4() {
  const router = useRouter();
  const { bankData, updateBankData } = useEmployeeRegistration();
  
  const methods = useForm<BankForm>({
    resolver: zodResolver(bankSchema),
    defaultValues: bankData,
  });

  const onSubmit = (data: BankForm) => {
    updateBankData(data);
    router.push("/main/employees/register/credentials");
  };

  const handleBack = () => {
    const formData = methods.getValues();
    updateBankData(formData);
    router.push("/main/employees/register/documents");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl">
        <div className="px-6 md:px-8 pt-4">
          <Tabs defaultValue="bank" className="w-full">
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
              <TabsTrigger value="bank" className="gap-2">
                <Wallet className="w-4 h-4" /> Dados Bancários
              </TabsTrigger>
              <TabsTrigger 
                value="credentials" 
                className="gap-2"
                onClick={() => router.push("/main/employees/register/credentials")}
              >
                <Lock className="w-4 h-4" /> Credenciais
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bank" className="mt-6" />
          </Tabs>
        </div>

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="px-6 md:px-8 pb-6 md:pb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              methods={methods} 
              name="account" 
              label="Conta" 
              placeholder="Conta" 
            />
            <Input 
              methods={methods} 
              name="agency" 
              label="Agência" 
              placeholder="Agência" 
            />
            <Input 
              methods={methods} 
              name="verificationDigit" 
              label="Dígito Verificador" 
              placeholder="Dígito Verificador" 
            />
            <Select
              methods={methods}
              name="bank"
              label="Banco"
              placeholder="Selecione o banco"
            >
              {bankOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button type="submit">
              Continuar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
