"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectItem } from "@/app/components/ui/select";
import type { Position } from "../positions-content";

const schema = z.object({
  name: z.string().min(2, "Informe o nome do cargo"),
  department: z.string().min(1, "Selecione o departamento"),
  baseSalary: z
    .string()
    .min(1, "Informe o salário base")
});

type FormValues = z.infer<typeof schema>;

const DEPARTMENTS = ["RH", "TI", "Marketing", "Financeiro", "Operações", "Comercial"];

export function CreatePositionDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (p: Position) => void;
}) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", department: "", baseSalary: "" },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (data: FormValues) => {
      const parseCurrency = (value: string) => {
        const n = value.replace(/[^0-9,.-]/g, "").replace(".", "").replace(",", ".");
        const num = Number(n);
        return isNaN(num) ? 0 : num;
      };

      const newPosition: Position = {
        id: Math.random().toString(36).slice(2),
        name: data.name.trim(),
        department: data.department,
        baseSalary: parseCurrency(data.baseSalary),
        status: "Ativo",
        links: 0,
      };

      onCreated(newPosition);
      onOpenChange(false);
      methods.reset();
    },
    [methods, onCreated, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>Cadastrar cargo</DialogHeader>
        <div className="px-8 pt-2 pb-2 space-y-4">
          <Input name="name" label="Nome" placeholder="Desenvolvedor Java" methods={methods} required />
          <Select name="department" label="Departamento" placeholder="Selecione..." methods={methods}>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </Select>
          <Input
            name="baseSalary"
            label="Salário Base"
            placeholder="R$ 4.500,00"
            methods={methods}
            isNumeric
            valueIsNumericString
            thousandSeparator="."
            decimalSeparator="," 
            prefix="R$ "
            decimalScale={2}
            required
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={methods.handleSubmit(onSubmit)} className="bg-primary hover:bg-primary/90 text-white">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
