"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Position } from "../types";

interface ViewPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position | null;
  onEdit: (position: Position) => void; // enviar atualização ao pai
}

export function ViewPositionDialog({
  open,
  onOpenChange,
  position,
  onEdit,
}: ViewPositionDialogProps) {
  const [isEditing, setIsEditing] = useState(false);

  // React Hook Form
  const { register, handleSubmit, reset } = useForm<Position>({
    defaultValues: position || {},
  });

  // Atualiza os valores sempre que abrir o modal
  useEffect(() => {
    if (position) reset(position);
  }, [position, reset]);

  if (!position) return null;

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleSave = (data: Position) => {
    onEdit(data); // envia para o pai
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      onOpenChange(v);
      if (!v) setIsEditing(false); // limpa modo edição ao fechar
    }}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-[#DEE2E6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-lg font-semibold text-[#212529]">
                {isEditing ? "Editar Cargo" : "Informações do Cargo"}
              </DialogTitle>
            </div>

            {!isEditing && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-primary/90 text-white w-auto whitespace-nowrap"
              >
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <form onSubmit={handleSubmit(handleSave)}>
          <div className="px-6 py-6 space-y-6">

            {/* Nome */}
            <div>
              <p className="text-xs font-medium text-[#868E96] mb-1">Nome</p>

              {isEditing ? (
                <Input {...register("name")} />
              ) : (
                <p className="text-sm text-[#212529] font-medium">
                  {position.name || "N/A"}
                </p>
              )}
            </div>

            {/* Departamento */}
            <div>
              <p className="text-xs font-medium text-[#868E96] mb-1">
                Departamento
              </p>

              {isEditing ? (
                <Input {...register("departamento.nome")} />
              ) : (
                <p className="text-sm text-[#212529]">
                  {position.departamento?.nome || "N/A"}
                </p>
              )}
            </div>

            {/* Salário */}
            <div>
              <p className="text-xs font-medium text-[#868E96] mb-1">
                Salário Base
              </p>

              {isEditing ? (
                <Input type="number" step="0.01" {...register("salarioBase", { valueAsNumber: true })} />
              ) : (
                <p className="text-sm text-[#212529] font-medium">
                  {position.salarioBase ? formatCurrency(position.salarioBase) : "N/A"}
                </p>
              )}
            </div>
          </div>

          {/* Ações */}
          {isEditing && (
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  reset(position); 
                }}
              >
                Cancelar
              </Button>

              <Button type="submit" className="bg-primary text-white">
                Salvar alterações
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
