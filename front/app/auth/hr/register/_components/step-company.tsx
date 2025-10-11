"use client";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import type { Step1Form } from "./schemas";

export function StepCompany({
  methods,
  onSubmit,
  isLoading,
}: {
  methods: UseFormReturn<Step1Form>;
  onSubmit: (data: Step1Form) => void;
  isLoading?: boolean;
}) {
  return (
    <form
      onSubmit={methods.handleSubmit((data) => onSubmit(data))}
      className="space-y-6"
    >
      <Input
        methods={methods}
        name="razaoSocial"
        placeholder="Ex.: Empresa Exemplo S.A."
        label="Razão Social"
        required
      />
      <Input
        methods={methods}
        name="cnpj"
        placeholder="00.000.000/0000-00"
        label="CNPJ"
        required
        mask={["99.999.999/9999-99"]}
        maxLength={18}
        inputMode="numeric"
        onKeyDown={(e) => {
          const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"]; 
          if (/^\d$/.test(e.key) || allowed.includes(e.key)) return; 
          e.preventDefault();
        }}
      />
      <Button className="h-12" isLoading={isLoading}>
        Continuar
      </Button>
    </form>
  );
}
