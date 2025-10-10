"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { UserCircle, AddressBook, Bank, HashStraightIcon, BankIcon } from "@phosphor-icons/react";

const companySchema = y.object({
  razaoSocial: y.string().required("Por favor, insira a Razão Social"),
  cnpj: y
    .string()
    .matches(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/g, "CNPJ deve estar no formato 00.000.000/0000-00")
    .required("Por favor, insira o CNPJ"),
});

export type CompanyFormValues = y.InferType<typeof companySchema>;

export function CompanyForm({ onNext, onSubmitCompanyData }: { 
  onNext: () => void; 
  onSubmitCompanyData: (data: CompanyFormValues) => void;
}) {
  const methods = useForm<CompanyFormValues>({
    resolver: yupResolver(companySchema),
    defaultValues: { razaoSocial: "", cnpj: "" },
  });

  return (
    <form
      onSubmit={methods.handleSubmit((data) => {
        onSubmitCompanyData(data);
        onNext();
      })}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4">
        <Input
          name="razaoSocial"
          label="Razão Social"
          placeholder="Laticínio S.A."
          required
          methods={methods}
          startContent={<BankIcon />}
        />
        <Input
          name="cnpj"
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          required
          methods={methods}
          mask="##.###.###/####-##"
          startContent={<HashStraightIcon />}
        />
      </div>

      <Button>Continuar</Button>
    </form>
  );
}
