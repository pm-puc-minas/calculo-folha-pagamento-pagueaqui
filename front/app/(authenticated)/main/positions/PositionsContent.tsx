/**
 * PositionsContent Component
 * Main component for positions page following design specifications
 * Consumes backend API
 */

"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Briefcase, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PositionsTable } from "./components/PositionsTable";
import { CreatePositionDialog } from "./components/CreatePositionDialog";
import { DeletePositionDialog } from "./components/DeletePositionDialog";
import { ViewPositionDialog } from "./components/ViewPositionDialog";
import {
  usePositions,
  useCreatePosition,
  useDeletePosition,
  formatError,
} from "./api";
import type { Position, PositionFormInput } from "./types";
import { AxiosError } from "axios";

export function PositionsContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { data: positions = [], isLoading } = usePositions();
  const createMutation = useCreatePosition();
  const deleteMutation = useDeletePosition();

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleConfirmCreate = async (data: PositionFormInput) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Cargo criado com sucesso!");
      handleCloseCreate();
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? formatError(error as any, "Erro ao criar cargo. Tente novamente.")
          : "Erro ao criar cargo. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  const handleOpenView = (position: Position) => {
    setSelectedPosition(position);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedPosition(null);
  };

  const handleOpenEdit = (position: Position) => {
    // TODO: Backend doesn't have update endpoint
    toast.error("Edição não disponível - aguardando endpoint no backend");
  };

  const handleOpenDelete = (position: Position) => {
    setSelectedPosition(position);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setSelectedPosition(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPosition) return;

    try {
      await deleteMutation.mutateAsync(selectedPosition.id);
      toast.success("Cargo excluído com sucesso!");
      handleCloseDelete();
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? formatError(error as any, "Erro ao excluir cargo. Tente novamente.")
          : "Erro ao excluir cargo. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-[#DEE2E6]">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-[#868E96]" />
            <span className="text-2xl font-semibold text-[#212529]">
              {positions.length}
            </span>
            <span className="text-sm text-[#868E96]">Cargos</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Buscar cargos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-[#DEE2E6] rounded-lg text-sm placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Buscar cargos"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
            </div>
            <Button
              className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-4 w-auto whitespace-nowrap"
              onClick={handleOpenCreate}
            >
              <Plus className="w-4 h-4" />
              Cadastrar Cargo
            </Button>
          </div>
        </div>

        {/* Table */}
        <PositionsTable
          positions={positions}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>

      {/* Create Dialog */}
      <CreatePositionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onConfirm={handleConfirmCreate}
        isCreating={createMutation.isPending}
      />

      {/* View Dialog */}
      <ViewPositionDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        position={selectedPosition}
        onEdit={handleOpenEdit}
      />

      {/* Delete Dialog */}
      <DeletePositionDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        position={selectedPosition}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
