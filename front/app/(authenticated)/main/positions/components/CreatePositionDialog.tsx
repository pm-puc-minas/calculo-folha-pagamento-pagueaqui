/**
 * CreatePositionDialog Component
 * Modal for creating new positions
 * Following design specifications
 */

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select/select-shadcn";
import { X } from "lucide-react";
import type { PositionFormInput } from "../types";
import { useDepartments } from "../api";

interface CreatePositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: PositionFormInput) => Promise<void>;
  isCreating: boolean;
}

export function CreatePositionDialog({
  open,
  onOpenChange,
  onConfirm,
  isCreating,
}: CreatePositionDialogProps) {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [salarioBase, setSalarioBase] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: departments = [], isLoading: isDepartmentsLoading } =
    useDepartments();

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName("");
      setDepartmentId("");
      setSalarioBase("");
      setErrors({});
    }
  }, [open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!departmentId) {
      newErrors.departamento = "Departamento é obrigatório";
    }

    if (!salarioBase.trim()) {
      newErrors.salarioBase = "Salário base é obrigatório";
    } else {
      const value = parseFloat(salarioBase.replace(/\./g, "").replace(",", "."));
      if (isNaN(value) || value <= 0) {
        newErrors.salarioBase = "Salário base deve ser um valor válido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const salaryValue = parseFloat(
      salarioBase.replace(/\./g, "").replace(",", ".")
    );

    const data: PositionFormInput = {
      name: name.trim(),
      departamento: {
        id: parseInt(departmentId),
      },
      salarioBase: salaryValue,
    };

    await onConfirm(data);
  };

  const formatCurrency = (value: string): string => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";

    // Convert to number and format
    const number = parseInt(numbers) / 100;
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setSalarioBase(formatted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-[#DEE2E6]">
          <DialogTitle className="text-lg font-semibold text-[#212529]">
            Cadastrar cargo
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[#212529]">
              Nome
            </Label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Desenvolvedor Java"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              className={`w-full h-10 px-3 py-2 text-sm border rounded-md bg-white placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#DEE2E6]"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Department Field */}
          <div className="space-y-2">
            <Label
              htmlFor="departamento"
              className="text-sm font-medium text-[#212529]"
            >
              Departamento
            </Label>
            <Select
              value={departmentId}
              onValueChange={setDepartmentId}
              disabled={isCreating || isDepartmentsLoading}
            >
              <SelectTrigger
                className={`h-10 ${
                  errors.departamento
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#DEE2E6]"
                }`}
              >
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.departamento && (
              <p className="text-xs text-red-500">{errors.departamento}</p>
            )}
          </div>

          {/* Salary Field */}
          <div className="space-y-2">
            <Label
              htmlFor="salarioBase"
              className="text-sm font-medium text-[#212529]"
            >
              Salário Base
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#868E96] text-sm">
                R$
              </span>
              <input
                id="salarioBase"
                name="salarioBase"
                type="text"
                placeholder="4.500,00"
                value={salarioBase}
                onChange={handleSalaryChange}
                disabled={isCreating}
                className={`w-full h-10 pl-10 pr-3 py-2 text-sm border rounded-md bg-white placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.salarioBase
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#DEE2E6]"
                }`}
              />
            </div>
            {errors.salarioBase && (
              <p className="text-xs text-red-500">{errors.salarioBase}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-primary hover:bg-primary/90 text-white px-6"
            >
              {isCreating ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
