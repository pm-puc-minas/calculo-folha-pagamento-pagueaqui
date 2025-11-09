"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Calendar, IdCard, Lock, User2, Wallet, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEmployeeRegistration } from "@/app/context/employeeRegistrationContext";
import { getBankByCode } from "@/app/lib/external/brasilapi";

const bankTexts = {
  accountRequired: "Conta é obrigatória",
  agencyRequired: "Agência é obrigatória",
  verificationDigitRequired: "Dígito verificador é obrigatório",
  bankRequired: "Banco é obrigatório",
};

const bankSchema = z.object({
  account: z.string().min(1, bankTexts.accountRequired),
  agency: z.string().min(1, bankTexts.agencyRequired),
  verificationDigit: z.string().min(1, bankTexts.verificationDigitRequired),
  bank: z.string().min(1, bankTexts.bankRequired),
  bankCode: z.string().optional(),
});

type BankForm = z.infer<typeof bankSchema>;

export default function EmployeeRegisterStep4() {
  const router = useRouter();
  const { bankData, updateBankData } = useEmployeeRegistration();
  const [bankLookupLoading, setBankLookupLoading] = useState(false);
  const [bankLookupError, setBankLookupError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  
  const methods = useForm<BankForm>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      ...bankData,
      bankCode: bankData.bankCode || "",
    },
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

  const bankCode = methods.watch("bankCode");
  useEffect(() => {
    const code = (bankCode || "").toString().trim();
    setBankLookupError(null);

    if (!code || !/^\d{3}$/.test(code)) {
      methods.setValue("bank", "", { shouldValidate: true, shouldDirty: true });
      setBankLookupLoading(false);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    const timer = setTimeout(async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setBankLookupLoading(true);
        const data = await getBankByCode(code, { signal: ctrl.signal });
        methods.setValue("bank", data.name, { shouldValidate: true, shouldDirty: true });
      } catch (err: any) {
        methods.setValue("bank", "", { shouldValidate: true, shouldDirty: true });
        setBankLookupError(err?.message || "Não foi possível buscar o banco");
      } finally {
        setBankLookupLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [bankCode]);

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
            <Input
              methods={methods}
              name="bankCode"
              label="Código do Banco"
              placeholder="Ex.: 001, 033, 341"
              inputMode="numeric"
              maxLength={3}
              mask="999"
              endContent={
                (methods.watch("bankCode") || "").toString().length > 0 ? (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 mr-2"
                    aria-label="Limpar código"
                    onClick={() => {
                      methods.setValue("bankCode", "");
                      setBankLookupError(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null
              }
            />
            <Input
              methods={methods}
              name="bank"
              label="Banco"
              placeholder="Preenchido automaticamente pelo código"
              readOnly
            />
            <div className="hidden md:block" />
            {bankLookupError && (
              <div className="md:col-span-2 -mt-2">
                <p className="text-red-500 text-sm">{bankLookupError}</p>
              </div>
            )}
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
