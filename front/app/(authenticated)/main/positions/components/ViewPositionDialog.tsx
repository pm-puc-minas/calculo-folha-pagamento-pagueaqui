/**
 * ViewPositionDialog Component
 * View position details in a modal
 * Following design specifications
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { User } from "lucide-react";
import type { Position } from "../types";

interface ViewPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position | null;
  onEdit: (position: Position) => void;
}

export function ViewPositionDialog({
  open,
  onOpenChange,
  position,
  onEdit,
}: ViewPositionDialogProps) {
  if (!position) return null;

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-[#DEE2E6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-lg font-semibold text-[#212529]">
                Informações do Cargo
              </DialogTitle>
            </div>
            {/* TODO: Edit button disabled - backend has no update endpoint */}
            <Button
              variant="default"
              size="sm"
              disabled
              className="bg-primary hover:bg-primary/90 text-white opacity-50 cursor-not-allowed w-auto whitespace-nowrap"
              title="Editar não disponível - aguardando endpoint no backend"
            >
              Editar Cargo
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Name */}
          <div>
            <p className="text-xs font-medium text-[#868E96] mb-1">Nome</p>
            <p className="text-sm text-[#212529] font-medium">
              {position.name || "N/A"}
            </p>
          </div>

          {/* Department */}
          <div>
            <p className="text-xs font-medium text-[#868E96] mb-1">
              Departamento
            </p>
            <p className="text-sm text-[#212529]">
              {position.departamento?.nome || "N/A"}
            </p>
          </div>

          {/* Salary */}
          <div>
            <p className="text-xs font-medium text-[#868E96] mb-1">
              Salário Base
            </p>
            <p className="text-sm text-[#212529] font-medium">
              {position.salarioBase ? formatCurrency(position.salarioBase) : "N/A"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
