/**
 * CreateDepartmentDialog Component
 * Form dialog for creating new departments
 * Based on backend validation: nome is required (NotBlank)
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogMain,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import type { DepartmentFormInput } from "../types";

interface CreateDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: DepartmentFormInput) => void;
  isCreating?: boolean;
}

export function CreateDepartmentDialog({
  open,
  onOpenChange,
  onConfirm,
  isCreating = false,
}: CreateDepartmentDialogProps) {
  const [nome, setNome] = useState("");
  const [errors, setErrors] = useState<{ nome?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { nome?: string } = {};
    if (!nome.trim()) {
      newErrors.nome = "Nome do departamento é obrigatório";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({ nome: nome.trim() });
  };

  const handleClose = () => {
    if (!isCreating) {
      setNome("");
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-primary"
            >
              <path
                d="M5 5h10M5 10h10M5 15h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Informações do Departamento</span>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogMain>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-[#495057]"
                >
                  Nome do Departamento
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    setErrors((prev) => ({ ...prev, nome: undefined }));
                  }}
                  placeholder="Digite o nome do departamento"
                  disabled={isCreating}
                  className={`w-full h-10 px-3 border rounded-lg text-sm placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.nome ? "border-red-500" : "border-[#DEE2E6]"
                  }`}
                  aria-invalid={!!errors.nome}
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                />
                {errors.nome && (
                  <p id="nome-error" className="text-xs text-red-600">
                    {errors.nome}
                  </p>
                )}
              </div>
            </div>
          </DialogMain>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isCreating}
              disabled={isCreating}
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
