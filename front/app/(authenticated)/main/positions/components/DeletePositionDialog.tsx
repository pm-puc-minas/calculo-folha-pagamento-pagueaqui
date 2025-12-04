/**
 * DeletePositionDialog Component
 * Confirmation dialog for deleting positions
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
import { AlertCircle } from "lucide-react";
import type { Position } from "../types";

interface DeletePositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeletePositionDialog({
  open,
  onOpenChange,
  position,
  onConfirm,
  isDeleting,
}: DeletePositionDialogProps) {
  if (!position) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 bg-white">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-[#DEE2E6]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-[#212529]">
              Excluir cargo
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-sm text-[#495057] leading-relaxed">
            Você está prestes a excluir este cargo. Essa ação é permanente e não
            poderá ser desfeita. Tem certeza de que deseja continuar?
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-[#DEE2E6] flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="text-[#495057] hover:bg-[#F1F3F5]"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Excluindo..." : "Sim, Excluir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
