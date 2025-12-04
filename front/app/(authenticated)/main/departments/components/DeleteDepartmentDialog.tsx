/**
 * DeleteDepartmentDialog Component
 * Confirmation dialog for department deletion
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
import type { Department } from "../types";

interface DeleteDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteDepartmentDialog({
  open,
  onOpenChange,
  department,
  onConfirm,
  isDeleting = false,
}: DeleteDepartmentDialogProps) {
  if (!department) return null;

  const employeeCount = department.cargos?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Excluir Departamento</span>
          </div>
        </DialogHeader>

        <DialogMain>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Você está prestes a excluir o departamento{" "}
              <strong className="font-semibold text-gray-900">
                {department.nome}
              </strong>
              .
            </p>
            {employeeCount > 0 && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                ⚠️ Este departamento possui {employeeCount}{" "}
                {employeeCount === 1 ? "cargo associado" : "cargos associados"}.
                A exclusão pode afetar funcionários vinculados.
              </p>
            )}
            <p className="text-sm text-gray-600">
              Essa ação é{" "}
              <strong className="font-semibold text-red-600">permanente</strong>{" "}
              e{" "}
              <strong className="font-semibold text-red-600">
                não poderá ser desfeita
              </strong>
              . Todos os dados deste departamento serão removidos do sistema.
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
