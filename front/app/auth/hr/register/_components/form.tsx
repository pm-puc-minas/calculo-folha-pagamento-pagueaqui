"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";
import { formatError, api } from "@/app/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CompanyModel } from "@/app/lib/api/generated";
import { StepCompany } from "./step-company";
import { StepUser } from "./step-user";
import type { Step1Form, Step2Form } from "./schemas";
import { step1Schema, step2Schema } from "./schemas";

// schemas and types are imported from schemas.ts

async function createCompanyRequest(data: Step1Form) {
  // the backend expects numbers for cnpj internally; API accepts masked string per OpenAPI
  const response = await api.post<CompanyModel>("/companies/create", {
    cnpj: data.cnpj,
    razaoSocial: data.razaoSocial,
  });
  return response.data;
}

async function registerUserRequest(params: Step2Form & { companyId: number }) {
  const { companyId, ...user } = params;
  const response = await api.post<string>("/auth/register", {
    name: user.name,
    email: user.email,
    password: user.password,
    companyId,
  });
  return response.data;
}

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [companyCreated, setCompanyCreated] = useState<CompanyModel | null>(null);

  const methodsStep1 = useForm<Step1Form>({
    resolver: yupResolver(step1Schema),
    defaultValues: { razaoSocial: "", cnpj: "" },
    mode: "onChange",
  });

  const methodsStep2 = useForm<Step2Form>({
    resolver: yupResolver(step2Schema),
    defaultValues: { name: "", email: "", cpf: "", password: "" },
    mode: "onChange",
  });

  const { mutate: createCompany, isPending: creatingCompany } = useMutation({
    mutationFn: (data: Step1Form) => createCompanyRequest(data),
    onSuccess: (company) => {
      setCompanyCreated(company);
      setStep(2);
      toast.success("Empresa cadastrada! Continue com seus dados");
    },
    onError: (error: any) => toast.error(formatError(error, "Falha ao cadastrar empresa")),
  });

  const { mutate: registerUser, isPending: registering } = useMutation({
    mutationFn: (data: Step2Form & { companyId: number }) => registerUserRequest(data),
    onSuccess: (_msg: string) => {
      toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      router.push(`/auth/hr/verify?email=${methodsStep2.getValues("email")}`);
    },
    onError: (error: any) => toast.error(formatError(error, "Falha ao criar conta")),
  });

  const goBack = () => setStep(1);

  return (
    <div className="w-full">
      {step === 1 && (
        <StepCompany
          methods={methodsStep1}
          isLoading={creatingCompany}
          onSubmit={(data: Step1Form) => createCompany(data)}
        />
      )}

      {step === 2 && (
        <StepUser
          methods={methodsStep2}
          isLoading={registering}
          onBack={goBack}
          onSubmit={(data: Step2Form) => {
            if (!companyCreated?.id) {
              toast.error("Empresa não encontrada. Volte e tente novamente.");
              setStep(1);
              return;
            }
            registerUser({ ...data, companyId: Number(companyCreated.id) });
          }}
        />
      )}
    </div>
  );
}
