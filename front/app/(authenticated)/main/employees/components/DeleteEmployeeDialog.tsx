/**
 * DeleteEmployeeDialog Component
 * Confirmation dialog for employee deletion
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogMain,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Employee } from "../types";

interface DeleteEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteEmployeeDialog({
  open,
  onOpenChange,
  employee,
  onConfirm,
  isDeleting = false,
}: DeleteEmployeeDialogProps) {
  if (!employee) return null;

  const fullName = `${employee.nome} ${employee.sobrenome}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Excluir Colaborador</span>
          </div>
        </DialogHeader>

        <DialogMain>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Você está prestes a excluir o colaborador{" "}
              <strong className="font-semibold text-gray-900">{fullName}</strong>.
            </p>
            <p className="text-sm text-gray-600">
              Essa ação é <strong className="font-semibold text-red-600">permanente</strong> e{" "}
              <strong className="font-semibold text-red-600">não poderá ser desfeita</strong>.
              Todos os dados deste colaborador serão removidos do sistema.
            </p>
            <p className="text-sm font-medium text-gray-900">
              Tem certeza de que deseja continuar?
            </p>
          </div>
        </DialogMain>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
