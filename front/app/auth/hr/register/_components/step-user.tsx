"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { Step2Form } from "./schemas";

export function StepUser({
  methods,
  onSubmit,
  onBack,
  isLoading,
}: {
  methods: UseFormReturn<Step2Form>;
  onSubmit: (data: Step2Form) => void;
  onBack: () => void;
  isLoading?: boolean;
}) {
  return (
    <form
      onSubmit={methods.handleSubmit((data) => onSubmit(data))}
      className="space-y-6"
    >
      <Input
        methods={methods}
        name="name"
        placeholder="Seu nome completo"
        label="Nome completo"
        required
      />
      <Input
        methods={methods}
        name="email"
        type="email"
        placeholder="voce@empresa.com"
        label="E-mail"
        required
      />
      <Input
        methods={methods}
        name="cpf"
        placeholder="000.000.000-00"
        label="CPF"
        required
        mask={["999.999.999-99"]}
        maxLength={14}
        inputMode="numeric"
        onKeyDown={(e) => {
          const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"]; 
          if (/^\d$/.test(e.key) || allowed.includes(e.key)) return; 
          e.preventDefault();
        }}
      />
      <Input
        methods={methods}
        type="password"
        placeholder="********"
        name="password"
        label="Senha"
        required
      />

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="h-12" onClick={onBack}>
          Voltar
        </Button>
        <Button className="h-12" isLoading={isLoading}>
          Criar conta
        </Button>
      </div>
    </form>
  );
}
